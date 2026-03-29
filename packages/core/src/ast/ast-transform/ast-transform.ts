import type { ExtractCaptures } from "@/pattern";
import type { ConfigSlot } from "@/config/config-type";

/**
 * Import specifier key format:
 * - `"foo"`            → `import { foo } from "..."`
 * - `"foo as Bar"`     → `import { foo as Bar } from "..."`
 * - `"default as foo"` → `import foo from "..."`
 * - `"* as foo"`       → `import * as foo from "..."`
 */
type ImportSpecifier =
  | `${string}`
  | `${string} as ${string}`
  | `default as ${string}`
  | `* as ${string}`;

type ImportMap = Record<ImportSpecifier, string | ConfigSlot>;

type ExtractConfigFromImports<M> = {
  [K in keyof M as M[K] extends ConfigSlot<infer N, any> ? N : never]: string;
};

/**
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
