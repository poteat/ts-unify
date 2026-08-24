import type { FluentNode } from '@/ast/fluent-node'

/**
 * Adds the quantifier `.atMost(n)`: inside `.where()`, the match passes
 * when at most `n` nodes of the scoped search match the pattern.
 */
export type NodeWithAtMost<N> = {
  /**
   * Quantifier terminal: the constraint passes when the search scope holds
   * at most the given count of nodes matching this pattern.
   *
   * @param n the largest count that passes
   */
  readonly atMost: (n: number) => FluentNode<N>
}
