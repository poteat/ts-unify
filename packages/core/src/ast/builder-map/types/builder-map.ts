import type { BuilderUtilities } from '@/ast/builder-utilities'
import type { NodeKind } from '@/ast/node-kind'
import type { PatternBuilder } from '@/ast/pattern-builder'

/**
 * Map from `NodeKind` to its corresponding `PatternBuilder`.
 *
 * This represents the public surface of the builder registry (e.g., `U`).
 */
export type BuilderMap = {
  [K in NodeKind]: PatternBuilder<K>
} & BuilderUtilities
