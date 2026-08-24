import type { TSESTree } from '@typescript-eslint/types'

import type { FLUENT_INNER } from '@/ast/fluent-node'
import type { NodeByKind } from '@/ast/node-by-kind'
import type { NodeKind } from '@/ast/node-kind'
import type { SEQ_BRAND } from '@/ast/seq-brand'
import type { Spread, DollarObjectSpread } from '@/capture'
import type { Capturable } from '@/capture/capturable'
import type { CaptureLike } from '@/capture/capture-like'
import type { StringPredicate } from '@/string-predicate/string-predicate'

// For object shapes, allow specifying any subset of keys.
// Omitted keys are treated as "don't care" by consumers.
type PatternChildren<T> = {
  [K in keyof T]?: Pattern<T[K]>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SequenceItem<E> =
  | Pattern<E>
  | CaptureLike<E>
  | Spread<string, any>
  | { readonly [SEQ_BRAND]: unknown }

type SequencePattern<S extends readonly unknown[]> = ReadonlyArray<
  SequenceItem<S[number]>
>

// Allow object patterns to optionally constrain the parent node. This does not
// contribute captures; it's a provider-level acceptance hook. A comment is
// never a parent, and a parent `Program` is the upstream interface (its
// comments raw): both keep the parent union within what the compiler can
// represent.
type ParentShape =
  | NodeByKind[Exclude<NodeKind, 'Comment' | 'Program'>]
  | TSESTree.Program
// A parent pattern is one level deep: a capture, a fluent node, or a shape
// whose `type` is checked and whose other keys are taken as given. Every
// AST node carries a `parent`, so a parent pattern as deep as the node
// would let assignability walk the whole node graph through it.
type ParentPattern =
  | CaptureLike<ParentShape>
  | { readonly [FLUENT_INNER]: unknown }
  | ({ readonly type?: Capturable<ParentShape['type']> } & {
      readonly [key: string]: unknown
    })
type WithParent = { parent?: ParentPattern }

// A string position also accepts a string predicate, or a RegExp standing for one.
type StringPattern<T> = T extends string
  ? Capturable<T> | StringPredicate | RegExp
  : Capturable<T>

/**
 * Deeply capturable pattern for a shape `T`.
 *
 * At any position you may either:
 * - Provide a nested pattern of the original value type, or
 * - Provide a capture token (implicit `$` or explicit `Capture`), or
 * - In sequence positions (arrays/tuples), provide a spread capture `Spread`, or
 * - In string positions, provide a string predicate (`U.string.*`) or a `RegExp`.
 *
 * Any AST node is accepted at any node position: a captured value (typed by
 * where it was captured) can be placed where a rebuilt node wants a narrower
 * kind, and the runtime does not check kinds.
 *
 * This type defines what inputs are accepted; consumers interpret semantics
 * such as naming, anchoring, and unification.
 */
export type Pattern<T> = T extends readonly any[]
  ? Capturable<T> | SequencePattern<T>
  : T extends object
    ?
        | Capturable<T>
        | TSESTree.Node
        | (PatternChildren<T> & WithParent)
        | (PatternChildren<T> & DollarObjectSpread)
        | (PatternChildren<T> & DollarObjectSpread & WithParent)
        | DollarObjectSpread
        | WithParent
    : StringPattern<T>
