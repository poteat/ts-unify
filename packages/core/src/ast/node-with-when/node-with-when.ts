import type { HasSingleCapture } from '@/ast/capture-cardinality'
import type { FluentNode } from '@/ast/fluent-node'
import type { NarrowSingleCapture } from '@/ast/narrow-single-capture'
import type { SubstituteCaptures } from '@/ast/substitute-captures'
import type { ExtractCaptures } from '@/pattern'
import type { SingleValueOf } from '@/type-utils/single-value-of'

/**
 * Adds a fluent `.when` that keeps a match only while a guard or predicate
 * holds, over the one capture's value or over the whole bag.
 */
export type NodeWithWhen<Node> = Node & {
  /**
   * Keeps the match when the guard holds over the one capture's value,
   * and narrows that capture, in the bag and in the node shape.
   */
  when<VNarrow extends SingleValueOf<ExtractCaptures<Node>>>(
    guard: [HasSingleCapture<Node>] extends [true]
      ? (value: SingleValueOf<ExtractCaptures<Node>>) => value is VNarrow
      : never,
  ): NarrowSingleCapture<Node, VNarrow>

  /**
   * Keeps the match when the predicate holds over the one capture's
   * value; nothing narrows.
   */
  when(
    predicate: [HasSingleCapture<Node>] extends [true]
      ? (value: SingleValueOf<ExtractCaptures<Node>>) => boolean
      : never,
  ): [HasSingleCapture<Node>] extends [true] ? FluentNode<Node> : never

  /**
   * Keeps the match when the guard holds over the bag, and narrows every
   * capture the guard refines.
   */
  when<Narrow extends ExtractCaptures<Node>>(
    guard: (bag: ExtractCaptures<Node>) => bag is Narrow,
  ): FluentNode<SubstituteCaptures<Node, Narrow>>

  /**
   * Keeps the match when the predicate holds over the bag; nothing
   * narrows.
   */
  when(predicate: (bag: ExtractCaptures<Node>) => boolean): FluentNode<Node>
}
