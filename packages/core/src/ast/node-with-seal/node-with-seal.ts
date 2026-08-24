import type { HasManyCaptures } from '@/ast/capture-cardinality'
import type { FluentNode } from '@/ast/fluent-node'
import type { Sealed } from '@/ast/sealed'

/**
 * Adds a fluent `.seal()` that brands a node.
 *
 * Embedded under an object property of a larger pattern, a sealed node's
 * one inner capture is re-keyed to the property's name during capture
 * extraction.
 */
export type NodeWithSeal<N> = {
  /**
   * Brands the node as sealed. On a node with several captures the result
   * is `never`, so the call is a type error: sealing does not apply.
   */
  readonly seal: () => [HasManyCaptures<N>] extends [true]
    ? never
    : FluentNode<Sealed<N>>
}
