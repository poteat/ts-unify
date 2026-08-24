import type { Bag } from '../../bag'
import Context from '../../context'
import type { ArrayPlan, SeqPlan } from '../../plan'
import { absorb } from '../absorb'
import { matchEndsPlans } from './match-ends-plans'
import { matchRunPlans } from './match-run-plans'

/**
 * Matches an array against the plan of an array pattern holding up to
 * two spread captures, and returns the captures; null on mismatch.
 *
 * With no spread the lengths must agree. One spread takes whatever the
 * elements around it leave. Two spreads take what is before and after the
 * first place the elements between them match.
 *
 * @param actual the array
 * @param plan the plan of the array pattern
 * @param at where the array sits in the match
 */
export function matchArrayPlan(
  actual: unknown[],
  plan: ArrayPlan,
  at: Context.Cursor,
): Bag | null {
  const { spreads, before, middle, after, seqs } = plan

  function recordSeq(seq: SeqPlan, index: number, bag: Bag) {
    if (!seq.factory) return

    at.ctx.recordSite({
      path: [...at.path, index],
      factory: seq.factory,
      scopeBag: bag,
      span: seq.length,
    })
  }

  if (spreads.length === 0) {
    if (actual.length !== before.length) return null
    const bag = matchRunPlans(actual, { elements: before, start: 0 }, at)
    if (!bag) return null

    for (const seq of seqs) recordSeq(seq, seq.start, bag)

    return bag
  }

  if (spreads.length === 1) {
    const bag = matchEndsPlans(actual, plan, at)
    const name = spreads[0].name || at.key

    if (bag && name) {
      bag[name] = actual.slice(before.length, actual.length - after.length)
      at.ctx.capturePaths[name] = at.path
    }

    return bag
  }

  if (spreads.length === 2) {
    if (actual.length < before.length + middle.length + after.length) {
      return null
    }

    const bag = matchEndsPlans(actual, plan, at)
    if (!bag) return null
    const mEnd = actual.length - after.length

    for (let pos = before.length; pos + middle.length <= mEnd; pos++) {
      if (
        !absorb(
          bag,
          matchRunPlans(actual, { elements: middle, start: pos }, at),
        )
      )
        continue
      const n1 = spreads[0].name || at.key

      if (n1) {
        bag[n1] = actual.slice(before.length, pos)
        at.ctx.capturePaths[n1] = at.path
      }

      if (spreads[1].name) {
        bag[spreads[1].name] = actual.slice(pos + middle.length, mEnd)
        at.ctx.capturePaths[spreads[1].name] = at.path
      }

      for (const seq of seqs) {
        const offsetInMiddle = seq.start - plan.firstSpread - 1
        if (offsetInMiddle < 0 || offsetInMiddle >= middle.length) continue
        recordSeq(seq, pos + offsetInMiddle, bag)
      }

      return bag
    }

    return null
  }

  return null
}
