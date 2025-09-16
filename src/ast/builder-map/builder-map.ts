import type { NodeKind, PatternBuilder } from "@/ast";

/**
 * Map from `NodeKind` to its corresponding `PatternBuilder`.
 *
 * This represents the public surface of the builder registry (e.g., `U`).
 */
export type BuilderMap = { [K in NodeKind]: PatternBuilder<K> };
