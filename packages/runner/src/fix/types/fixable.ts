import type { LintMatch } from '@ts-unify/runner/lint'

/**
 * A match whose rewrite produced a node: the one `fix` can serialize and
 * splice in.
 */
export type Fixable = LintMatch & { reified: object }
