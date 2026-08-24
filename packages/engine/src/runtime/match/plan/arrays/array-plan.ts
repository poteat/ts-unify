import type { Plan } from '../plan'
import type { SeqPlan, SpreadPlan } from './parts'

/**
 * The plan of an array pattern with its `U.seq()` proxies expanded: the
 * runs of element plans around its spreads, and where each seq landed.
 *
 * Without a spread `before` is every element and the lengths must agree.
 * One spread takes what `before` and `after` leave. Two take what is
 * before and after the first place `middle` matches. More never match.
 */
export type ArrayPlan = {
  kind: 'array'
  spreads: readonly SpreadPlan[]
  before: readonly Plan[]
  middle: readonly Plan[]
  after: readonly Plan[]

  /**
   * The index in the expanded pattern of the first spread; the seqs'
   * starts are offsets from there.
   */
  firstSpread: number

  seqs: readonly SeqPlan[]
}
