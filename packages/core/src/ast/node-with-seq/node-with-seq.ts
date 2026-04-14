/**
 * Sequential composition combinator for array patterns. Matches a
 * contiguous subsequence of elements and merges their captures.
 * Chain `.to(factory)` for inline rewriting of the matched elements.
 */
import type { SEQ_BRAND } from "@/ast/seq-brand";
import type { ExtractCaptures } from "@/pattern";
import type { Prettify } from "@/type-utils";

export type { SEQ_BRAND } from "@/ast/seq-brand";

/**
 * The type-level result of `U.seq(A, B, ...)`. Carries the element types
 * under SEQ_BRAND so ExtractCaptures can find and merge their captures.
 */
export type SeqResult<Elements extends readonly unknown[]> = {
  readonly [SEQ_BRAND]: Elements;
  /**
   * Attach an inline rewrite factory. The factory receives the merged
   * captures from all seq elements — fully typed via ExtractCaptures.
   */
  to<Result>(
    factory: (bag: Prettify<ExtractCaptures<SeqResult<Elements>>>) => Result
  ): SeqResult<Elements>;
};

export type SeqCombinator = {
  <Elements extends unknown[]>(...elements: Elements): SeqResult<Elements>;
};
