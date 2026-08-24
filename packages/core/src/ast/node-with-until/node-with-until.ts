import type { FluentNode } from '@/ast/fluent-node'

/**
 * Adds a fluent `.until(boundary)` that bounds how far `.excludes()`
 * walks the subtree: the search continues until it reaches the boundary.
 */
export type NodeWithUntil<N> = {
  /**
   * Attaches a walk boundary. When this node is passed to `.excludes()`,
   * the subtree search stops recursion at descendants matching it.
   *
   * @param boundary a pattern (a built node or `U.or(...)`) whose matches
   * end the search
   * @returns the same node shape, chainable
   */
  readonly until: (boundary: unknown) => FluentNode<N>
}
