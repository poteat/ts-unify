/**
 * NodeWithWhere<N>
 *
 * Adds a fluent `.where(...constraints)` method that gates a match on
 * quantified pattern searches over configurable scopes. Each constraint
 * is a pattern carrying a quantifier terminal (`.none()`, `.some()`, etc.)
 * and an optional scope modifier (`.until()`, `.global()`, `.project()`).
 */
import type { FluentNode } from "@/ast/fluent-node";

export type NodeWithWhere<N> = {
  /**
   * Gate the match on one or more quantified constraints. Each constraint
   * is a pattern whose chain carries a quantifier (`.none()`, `.some()`,
   * `.atLeast(N)`) and an optional scope modifier.
   *
   * Multiple `.where()` calls compose: all must pass.
   *
   * @param constraints Patterns with quantifier terminals.
   * @returns The same node shape, chainable.
   */
  where(...constraints: unknown[]): FluentNode<N>;
};
