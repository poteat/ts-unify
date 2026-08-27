import type { PATTERN_BUILDER_BRAND } from '@/ast/pattern-builder'

/**
 * A value that is not a pattern builder: the builder brand absent, so a
 * rewrite factory passed to `.to` is told from `U.<Kind>`.
 */
export type NotBuilder = { readonly [PATTERN_BUILDER_BRAND]?: never }
