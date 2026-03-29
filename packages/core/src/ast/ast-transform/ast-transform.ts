import type { ExtractCaptures } from "@/pattern";
import type { ExtractConfig } from "@/config/extract-config";
import type { Prettify } from "@/type-utils";

/**
 * AstTransform<In, Out, Cfg>
 *
 * Terminal descriptor produced by `.to(...)`.
 * Carries the input pattern shape (`from`), an output factory (`to`),
 * and an accumulated config shape from all positions.
 */
export type AstTransform<In, Out, Cfg extends Record<string, unknown> = {}> = {
  readonly from: In;
  readonly to: (bag: ExtractCaptures<In>) => Out;
  readonly importMap?: Record<string, string>;
  imports(map: Record<string, string>): AstTransform<In, Out, Cfg>;
  config<D extends Prettify<Cfg & ExtractConfig<In> & ExtractConfig<Out>>>(
    defaults: D
  ): AstTransform<In, Out, D>;
};
