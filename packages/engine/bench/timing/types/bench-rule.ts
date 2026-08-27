import type { RuleMeta } from '@ts-unify/runner'

/**
 * A rule as the benchmark takes it: its extracted meta beside the
 * transform it came from.
 */
export type BenchRule = { meta: RuleMeta; transform: unknown }
