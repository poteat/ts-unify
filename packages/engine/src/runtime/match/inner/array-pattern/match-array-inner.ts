import type { Bag } from '../../bag'
import Context from '../../context'
import Pattern from '../../pattern'
import Seqs from '../../seqs'
import { absorb } from '../absorb'
import { matchEnds } from './match-ends'
import { matchRun } from './match-run'

/**
 * Matches an array against an array pattern holding up to two spread
 * captures, and returns the captures; null on mismatch.
 *
 * With no spread the lengths must agree. One spread takes whatever the
 * elements around it leave. Two spreads take what is before and after the
 * first place the elements between them match.
 *
 * @param actual the array
 * @param expected the array pattern
 * @param at where the array sits in the match
 */
export function matchArrayInner(
  actual: unknown[],
  expected: unknown[],
  at: Context.Cursor,
): Bag | null {
  const { expanded, seqs } = Seqs.expandSeqs(expected)
  const spreadIndices = expanded.flatMap((e, i) =>
    Pattern.isSpread(e) ? [i] : [],
  )

  if (spreadIndices.length === 0) {
    if (actual.length !== expanded.length) return null
    const bag = matchRun(actual, { elements: expanded, start: 0 }, at)
    if (!bag) return null

    for (const seq of seqs) {
      Seqs.recordSeqSiteAt(seq, Context.childCursor(at, seq.start), bag)
    }

    return bag
  }

  if (spreadIndices.length === 1) {
    const si = spreadIndices[0]
    const before = expanded.slice(0, si)
    const after = expanded.slice(si + 1)
    const bag = matchEnds(actual, { before, after }, at)
    const name = (expanded[si] as { name: string }).name || at.key

    if (bag && name) {
      bag[name] = actual.slice(before.length, actual.length - after.length)
      at.ctx.capturePaths[name] = at.path
    }

    return bag
  }

  if (spreadIndices.length === 2) {
    const [si1, si2] = spreadIndices
    const before = expanded.slice(0, si1)
    const middle = expanded.slice(si1 + 1, si2)
    const after = expanded.slice(si2 + 1)

    if (actual.length < before.length + middle.length + after.length) {
      return null
    }

    const bag = matchEnds(actual, { before, after }, at)
    if (!bag) return null
    const mEnd = actual.length - after.length

    for (let pos = before.length; pos + middle.length <= mEnd; pos++) {
      if (!absorb(bag, matchRun(actual, { elements: middle, start: pos }, at)))
        continue
      const s1 = expanded[si1] as { name: string }
      const s2 = expanded[si2] as { name: string }
      const n1 = s1.name || at.key

      if (n1) {
        bag[n1] = actual.slice(before.length, pos)
        at.ctx.capturePaths[n1] = at.path
      }

      if (s2.name) {
        bag[s2.name] = actual.slice(pos + middle.length, mEnd)
        at.ctx.capturePaths[s2.name] = at.path
      }

      for (const seq of seqs) {
        const offsetInMiddle = seq.start - si1 - 1
        if (offsetInMiddle < 0 || offsetInMiddle >= middle.length) continue
        Seqs.recordSeqSiteAt(
          seq,
          Context.childCursor(at, pos + offsetInMiddle),
          bag,
        )
      }

      return bag
    }

    return null
  }

  return null
}
