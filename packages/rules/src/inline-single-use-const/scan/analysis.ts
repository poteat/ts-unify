import type { Inlinable } from './inlinable'
import type { Tally } from './tallies'

/**
 * One block read once: the const it can inline, the tally of every name
 * under it, and the earliest end of an effect under it (Infinity when
 * none), for the block above to read.
 */
export type Analysis = {
  found: Inlinable | null
  tallies: ReadonlyMap<string, Tally>
  minEffectEnd: number
}
