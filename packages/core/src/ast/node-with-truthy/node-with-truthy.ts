import type { Truthy } from '@/ast/builder-helpers'
import type { NarrowSingleCapture } from '@/ast/narrow-single-capture'
import type { SingleCaptureOnly } from '@/ast/single-capture-only'
import type { ExtractCaptures } from '@/pattern'
import type { SingleValueOf } from '@/type-utils/single-value-of'

/**
 * Adds a fluent `.truthy()` to a node value `N`: single-capture sugar for
 * `.when(U.truthy)`.
 *
 * The capture's value type loses the JavaScript falsy values
 * (`false | 0 | 0n | "" | null | undefined`).
 */
export type NodeWithTruthy<Node> = Node & {
  /**
   * Narrows the one capture to its truthy values; callable only on a node
   * with exactly one capture.
   */
  readonly truthy: (
    ..._enforce: SingleCaptureOnly<Node>
  ) => NarrowSingleCapture<Node, Truthy<SingleValueOf<ExtractCaptures<Node>>>>
}
