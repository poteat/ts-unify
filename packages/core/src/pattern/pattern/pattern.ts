import type { Capturable } from "@/capture/capturable";
import type { CaptureLike } from "@/capture/capture-like";
import type { Spread } from "@/capture";
import type { DollarObjectSpread } from "@/capture";
import type { NodeByKind } from "@/ast/node-by-kind";
import type { NodeKind } from "@/ast/node-kind";
import type { SEQ_BRAND } from "@/ast/seq-brand";
import type { TSESTree } from "@typescript-eslint/types";

// For object shapes, allow specifying any subset of keys.
// Omitted keys are treated as "don't care" by consumers.
type PatternChildren<T> = {
  [K in keyof T]?: Pattern<T[K]>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SequenceItem<E> = Pattern<E> | CaptureLike<E> | Spread<string, any> | { readonly [SEQ_BRAND]: unknown };

type SequencePattern<S extends readonly unknown[]> = ReadonlyArray<
  SequenceItem<S[number]>
>;

// Allow object patterns to optionally constrain the parent node. This does not
// contribute captures; it's a provider-level acceptance hook. A comment is
// never a parent, and a parent `Program` is the upstream interface (its
// comments raw): both keep the parent union within what the compiler can
// represent.
type ParentShape =
  | NodeByKind[Exclude<NodeKind, "Comment" | "Program">]
  | TSESTree.Program;
type WithParent = { parent?: Pattern<ParentShape> };

// A string position also accepts a RegExp, tested against the string.
type StringPattern<T> = T extends string ? Capturable<T> | RegExp : Capturable<T>;

/**
 * Deeply capturable pattern for a shape `T`.
 *
 * At any position you may either:
 * - Provide a nested pattern of the original value type, or
 * - Provide a capture token (implicit `$` or explicit `Capture`), or
 * - In sequence positions (arrays/tuples), provide a spread capture `Spread`, or
 * - In string positions, provide a `RegExp`.
 *
 * This type defines what inputs are accepted; consumers interpret semantics
 * such as naming, anchoring, and unification.
 */
export type Pattern<T> = T extends readonly any[]
  ? Capturable<T> | SequencePattern<T>
  : T extends object
  ?
      | Capturable<T>
      | (PatternChildren<T> & WithParent)
      | (PatternChildren<T> & DollarObjectSpread)
      | (PatternChildren<T> & DollarObjectSpread & WithParent)
      | DollarObjectSpread
      | WithParent
  : StringPattern<T>;
