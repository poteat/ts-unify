import type { FluentNode } from '@/ast/fluent-node'

/**
 * Adds the quantifier `.exactly(n)`: inside `.where()`, the match passes
 * when exactly `n` nodes of the scoped search match the pattern.
 */
export type NodeWithExactly<N> = {
  /**
   * Quantifier terminal: the constraint passes when the search scope holds
   * exactly the given count of nodes matching this pattern.
   *
   * @param n the count that passes
   */
  readonly exactly: (n: number) => FluentNode<N>
}
