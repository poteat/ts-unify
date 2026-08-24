import type { FluentNode } from '@/ast/fluent-node'

/**
 * Adds the quantifier `.atLeast(n)`: inside `.where()`, the match passes
 * when at least `n` nodes of the scoped search match the pattern.
 */
export type NodeWithAtLeast<N> = {
  /**
   * Quantifier terminal: the constraint passes when the search scope holds
   * at least the given count of nodes matching this pattern.
   *
   * @param n the smallest count that passes
   */
  readonly atLeast: (n: number) => FluentNode<N>
}
