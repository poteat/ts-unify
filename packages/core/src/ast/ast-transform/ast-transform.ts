import type { ExtractCaptures } from "@/pattern";
import type { ConfigSlot } from "@/config/config-type";

type ImportMap = Record<string, string | ConfigSlot>;

type ExtractConfigFromImports<M> = {
  [K in keyof M as M[K] extends ConfigSlot<infer N, any> ? N : never]: M[K] extends ConfigSlot<
    any,
    infer V
  >
    ? V
    : never;
};

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
  readonly importMap?: ImportMap;
  imports<M extends ImportMap>(
    map: M
  ): AstTransform<In, Out, Cfg & ExtractConfigFromImports<M>>;
  config<D extends Cfg>(defaults: D): AstTransform<In, Out, D>;
};
