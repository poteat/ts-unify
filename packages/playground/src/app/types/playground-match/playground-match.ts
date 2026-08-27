import type { LintMatch } from '@ts-unify/runner'

/**
 * A match as the playground lists it: the rule's match with its rewrite
 * serialized, null when the rewrite failed to serialize.
 */
export type PlaygroundMatch = LintMatch & { rewrite: string | null }
