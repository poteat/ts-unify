/**
 * NodeWithSeal<N>
 *
 * Adds a fluent `.seal()` method that brands a node so that, when embedded
 * under an object property in a larger pattern, a single inner capture can be
 * re-keyed to the embedding property name during capture extraction.
 */
export type NodeWithSeal<N> = {
  seal(): FluentNode<Sealed<N>>;
};

/** NodeWithSeal only declares `.seal()`; see `src/ast/sealed` for `Sealed`. */
import type { FluentNode } from "@/ast/fluent-node";
import type { Sealed } from "@/ast/sealed";
