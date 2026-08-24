import type { FluentNode } from '@/ast/fluent-node'

/**
 * Adds the quantifier `.none()`: inside `.where()`, the match is rejected
 * when any node of the scoped search matches the pattern.
 */
export type NodeWithNone<N> = {
  /**
   * Quantifier terminal: reject the match if any node in the search scope
   * matches this pattern.
   *
   * @returns The pattern with the quantifier attached, suitable for
   * passing to `.where()`.
   */
  readonly none: () => FluentNode<N>
}
