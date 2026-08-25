import type { TSESTree } from '@typescript-eslint/types'

import type { DollarObjectSpread } from '@/capture'
import type { Capturable } from '@/capture/capturable'

import type { PatternChildren, SequenceItem, StringPattern } from './types'
import type { WithParent } from './with-parent'

/**
 * What a pattern-consuming API accepts for a shape `T`: at any position, a
 * nested pattern of the original type or a capture token.
 *
 * A sequence position also takes a `Spread`; a string position a string
 * predicate or a `RegExp`; an object a `parent` key and `{ ...$ }`. Any AST
 * node is accepted at any node position, since the runtime checks no kind.
 */
export type Pattern<T> = T extends readonly unknown[]
  ? Capturable<T> | ReadonlyArray<SequenceItem<T[number]>>
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
