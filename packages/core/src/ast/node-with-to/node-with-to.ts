import type { NodeByKind } from '@/ast/node-by-kind'
import type { NodeKind } from '@/ast/node-kind'
import type { NormalizeCaptured } from '@/ast/normalize-captured'
import type {
  PatternBuilder,
  PATTERN_BUILDER_BRAND,
} from '@/ast/pattern-builder'
import type { SingleCaptureOnly } from '@/ast/single-capture-only'
import type { ExtractCaptures } from '@/pattern'
import type { WithoutInternalAstFields } from '@/type-utils'
import type { SingleValueOf } from '@/type-utils/single-value-of'

import type { ToAttached } from './to-attached'

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
   * @param builder the builder of the output kind
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
   * @param factory receives the capture bag of a match
   */
  to<Result>(
    factory: ((bag: ExtractCaptures<Node>) => Result) & {
      readonly [PATTERN_BUILDER_BRAND]?: never
    },
  ): ToAttached<Node, Result>
}
