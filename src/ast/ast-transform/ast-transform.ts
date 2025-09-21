import type { ExtractCaptures } from "@/pattern";

/**
 * AstTransform<In, Out>
 *
 * Terminal descriptor produced by `.to(...)`.
 * Carries the input pattern shape (`from`) and an output factory (`to`).
 */
export type AstTransform<In, Out> = {
  readonly from: In;
  readonly to: (bag: ExtractCaptures<In>) => Out;
};
