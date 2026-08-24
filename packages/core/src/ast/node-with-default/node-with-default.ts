import type { HasSingleCapture } from '@/ast/capture-cardinality'
import type { NarrowSingleCapture } from '@/ast/narrow-single-capture'

/**
 * Adds a fluent `.default(expr)` for single-capture nodes: where the
 * capture is absent, the match substitutes `expr`.
 */
export type NodeWithDefault<Node> = Node & {
  /**
   * Substitutes the given expression for the one capture when it is
   * absent, as `.map(v => v ?? expr)` would.
   *
   * Callable only on a node with exactly one capture.
   */
  default<Expr>(
    expr: [HasSingleCapture<Node>] extends [true] ? Expr : never,
  ): NarrowSingleCapture<Node, Expr>

  /**
   * The overload a node with no single capture falls to; unusable.
   */
  default(expr: never): never
}
