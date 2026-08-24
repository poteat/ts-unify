import type { HasSingleCapture } from '@/ast/capture-cardinality'
import type { FluentNode } from '@/ast/fluent-node'
import type { SubstituteSingleCapture } from '@/ast/substitute-single-capture'

export type NodeWithDefault<Node> = Node & {
  /**
   * Single-capture overload — available only when there is exactly one capture.
   * Equivalent to `.map(v => v ?? expr)`.
   */
  readonly default: (<Expr>(
    expr: [HasSingleCapture<Node>] extends [true] ? Expr : never,
  ) => [HasSingleCapture<Node>] extends [true]
    ? FluentNode<SubstituteSingleCapture<Node, Expr>>
    : never) &
    ((expr: never) => never)
}
