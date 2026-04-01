import type { ProxyNode } from "@ts-unify/core/internal";

/** Any value produced by the fluent API that carries a proxy trace. */
export type TransformLike = { readonly [k: symbol]: ProxyNode };
