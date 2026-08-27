import type { Inlinable } from './inlinables'
import type { Tally } from './tallies'

/**
 * One block read once: the const it can inline, the tally of every name
 * under it, and the earliest end of an effect under it.
 *
 * The block above reads it; the effect end is Infinity when none.
 */
export type Analysis = {
  found: Inlinable | null
  tallies: ReadonlyMap<string, Tally>
  minEffectEnd: number
}
