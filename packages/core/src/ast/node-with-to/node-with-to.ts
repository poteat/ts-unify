import type { NodeByKind } from '@/ast/node-by-kind'
import type { NodeKind } from '@/ast/node-kind'
import type { NormalizeCaptured } from '@/ast/normalize-captured'
import type { PatternBuilder } from '@/ast/pattern-builder'
import type { SingleCaptureOnly } from '@/ast/single-capture-only'
import type { ExtractCaptures } from '@/pattern'
import type { WithoutInternalAstFields } from '@/type-utils'
import type { SingleValueOf } from '@/type-utils/single-value-of'

import type { NotBuilder, ToAttached } from './types'

/**
 * Adds a `.to` method to a node value `N`, attaching a rewrite factory
 * that receives the capture bag derived from the node.
 *
 * The result still embeds inside another pattern, where an inner `.to()`
 * declares a local rewrite at that position, and carries the rule-level
 * helpers `.message`, `.recommended`, `.config` and `.imports`.
 */
export type NodeWithTo<Node> = {
  /**
   * Attaches the rewrite whose output is the one capture's value.
   *
   * Callable only on a node with exactly one capture.
   */
  to(
    ..._enforce: SingleCaptureOnly<Node>
  ): ToAttached<Node, NormalizeCaptured<SingleValueOf<ExtractCaptures<Node>>>>

  /**
   * Attaches the rewrite that fills a node kind with the captures, as
   * `.to(bag => Builder(bag))` would.
   *
   * @param builder the builder of the output kind
   * @returns the node as a transform carrying the rewrite, still embeddable in
   *          a pattern
   */
  to<K extends NodeKind>(
    builder: PatternBuilder<K>,
    ..._enforce: ExtractCaptures<Node> extends Omit<
      WithoutInternalAstFields<NodeByKind[K]>,
      'type'
    >
      ? []
      : [never]
  ): ToAttached<Node, WithoutInternalAstFields<NodeByKind[K]>>

  /**
   * Attaches the rewrite whose output the factory builds from the bag.
   *
   * @param factory receives the capture bag of a match
   * @returns the node as a transform carrying the factory's rewrite, still
   *          embeddable in a pattern
   */
  to<Result>(
    factory: ((bag: ExtractCaptures<Node>) => Result) & NotBuilder,
  ): ToAttached<Node, Result>
}
