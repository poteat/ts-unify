import type { FluentNode } from '@/ast/fluent-node'

/**
 * Adds the quantifier `.some()`: inside `.where()`, the match passes when
 * any node of the scoped search matches the pattern.
 */
export type NodeWithSome<N> = {
  /**
   * Quantifier terminal: the constraint passes when at least one node in
   * the search scope matches this pattern.
   */
  readonly some: () => FluentNode<N>
}
