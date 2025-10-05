/**
 * NodeWithSeal<N>
 *
 * Adds a fluent `.seal()` method that brands a node so that, when embedded
 * under an object property in a larger pattern, a single inner capture can be
 * re-keyed to the embedding property name during capture extraction.
 */
import type { HasManyCaptures } from "@/ast/capture-cardinality";
import type { FluentNode } from "@/ast/fluent-node";
import type { Sealed } from "@/ast/sealed";

// Cardinality helpers are provided by `capture-cardinality`.

export type NodeWithSeal<N> = {
  /**
   * Brands the node as sealed. In multi-capture contexts, returns `never`
   * (causing a type error) to signal that sealing does not apply.
   */
  seal(): [HasManyCaptures<N>] extends [true] ? never : FluentNode<Sealed<N>>;
};
