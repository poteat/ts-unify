import type { ExtractCaptures } from "@/pattern";
import type { AstTransform } from "@/ast/ast-transform";
import type { WithoutInternalAstFields } from "@/type-utils";
import type { PatternBuilder, PATTERN_BUILDER_BRAND } from "@/ast/pattern-builder";
import type { NodeKind } from "@/ast/node-kind";
import type { NodeByKind } from "@/ast/node-by-kind";
import type { HasSingleCapture } from "@/ast/capture-cardinality";
import type { NormalizeCaptured } from "@/ast/normalize-captured";
import type { SingleValueOf } from "@/type-utils/single-value-of";

/**
 * Result of attaching `.to(...)` to a node — both an `AstTransform`
 * (carries `from`, `to`, `message`, etc.) and a `Pattern<Node>` (embeddable
 * inside another pattern's structural shape).
 */
export type ToAttached<Node, Result, Cfg extends Record<string, unknown> = {}> = Node &
  AstTransform<Node, Result, Cfg>;

/**
 * Add a `.to` method to a node value `N`.
 *
 * `.to` attaches a rewrite factory that receives the capture bag derived
 * from the node. The result remains embeddable inside another pattern
 * (so inner `.to(...)` declares a local rewrite at that sub-position), and
 * also exposes the chainable rule-level helpers `.message`, `.recommended`,
 * `.config`, and `.imports` for top-level rule definitions.
 *
 * See `nested-to.spec.md` for the bottom-up evaluation semantics.
 */
export type NodeWithTo<Node> = {
  /**
   * Zero-arg sugar: finalize by returning the single capture value as output.
   * Enabled only when the capture bag has exactly one key.
   */
  to(
    ..._enforce: [HasSingleCapture<Node>] extends [true] ? [] : [never]
  ): ToAttached<Node, NormalizeCaptured<SingleValueOf<ExtractCaptures<Node>>>>;

  /**
   * Finalize the node by directly providing a builder for the output kind.
   * Accepts a `PatternBuilder<K>` and uses the concrete node shape for `K` as
   * the output type. Equivalent to `.to((bag) => Builder(bag))`.
   */
  to<K extends NodeKind>(
    builder: PatternBuilder<K>,
    ..._enforce: ExtractCaptures<Node> extends Omit<WithoutInternalAstFields<NodeByKind[K]>, "type">
      ? []
      : [never]
  ): ToAttached<Node, WithoutInternalAstFields<NodeByKind[K]>>;

  /**
   * Finalize the node with a rewrite factory.
   *
   * @typeParam Result Arbitrary result type produced by the factory (e.g., a
   * builder-produced node). Provider leaves this unconstrained; consumers may
   * restrict it further.
   * @param factory Callback receiving the capture bag.
   */
  to<Result>(
    factory: ((bag: ExtractCaptures<Node>) => Result) & {
      readonly [PATTERN_BUILDER_BRAND]?: never;
    },
  ): ToAttached<Node, Result>;
};
