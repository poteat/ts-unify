import type { HasSingleCapture } from '@/ast/capture-cardinality'
import type { FluentNode } from '@/ast/fluent-node'
import type { SubstituteSingleCapture } from '@/ast/substitute-single-capture'

/**
 * The fluent node with its one capture's value replaced by `Value`;
 * `never` when `Node` has no capture or more than one.
 */
export type NarrowSingleCapture<Node, Value> = [
  HasSingleCapture<Node>,
] extends [true]
  ? FluentNode<SubstituteSingleCapture<Node, Value>>
  : never
