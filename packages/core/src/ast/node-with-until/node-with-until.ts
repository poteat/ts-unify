/**
 * NodeWithUntil<N>
 *
 * Adds a fluent `.until(boundary)` method that attaches a boundary pattern
 * controlling how far `.excludes()` walks when searching the subtree. The
 * name follows LTL convention: the search continues *until* the boundary
 * is reached.
 */
import type { FluentNode } from "@/ast/fluent-node";

export type NodeWithUntil<N> = {
  /**
   * Attach a walk boundary. When this node is passed to `.excludes()`, the
   * subtree search stops recursion at descendants matching `boundary`.
   *
   * @param boundary A pattern (builder-produced node or `U.or(...)`) whose
   * matching descendants act as scope boundaries.
   * @returns The same node shape, chainable.
   */
  until(boundary: unknown): FluentNode<N>;
};
