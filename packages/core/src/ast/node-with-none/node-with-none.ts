/**
 * NodeWithNone<N>
 *
 * Adds a fluent `.none()` quantifier terminal. When used inside a `.where()`
 * constraint, the match is rejected if any node in the scoped search matches
 * the pattern.
 */
import type { FluentNode } from "@/ast/fluent-node";

export type NodeWithNone<N> = {
  /**
   * Quantifier terminal: reject the match if any node in the search scope
   * matches this pattern.
   *
   * @returns The pattern with the quantifier attached, suitable for
   * passing to `.where()`.
   */
  none(): FluentNode<N>;
};
