import type { FluentNode } from '@/ast/fluent-node'

/**
 * Adds a fluent `.where(...constraints)` that gates a match on quantified
 * searches over a scope.
 *
 * Each constraint is a pattern carrying a quantifier terminal (`.none()`,
 * `.some()`, `.atLeast(n)`) and, optionally, a scope modifier
 * (`.until()`, `.global()`, `.project()`).
 */
export type NodeWithWhere<N> = {
  /**
   * Gates the match on the given constraints; every one must pass, and
   * several `.where()` calls compose the same way.
   *
   * @param constraints patterns with quantifier terminals
   * @returns the same node shape, chainable
   */
  readonly where: (...constraints: unknown[]) => FluentNode<N>
}
