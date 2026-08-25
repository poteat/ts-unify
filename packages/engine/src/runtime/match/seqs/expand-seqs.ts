import Pattern from '@ts-unify/engine/runtime/match/pattern'

import type { SeqInfo } from './types'
/**
 * The elements of an array pattern with every `U.seq()` proxy replaced by
 * its constituents, and where each seq landed, for its inline rewrite.
 *
 * @param expected the array pattern
 */
export function expandSeqs(expected: unknown[]): {
  expanded: unknown[]
  seqs: SeqInfo[]
} {
  const expanded: unknown[] = []
  const seqs: SeqInfo[] = []

  for (const elem of expected) {
    if (Pattern.isProxyNode(elem)) {
      const pn = Pattern.patternNodeOf(elem)

      if (pn.tag === 'seq') {
        const start = expanded.length

        for (const arg of pn.args) expanded.push(arg)

        seqs.push({ start, length: pn.args.length, chain: pn.chain })
        continue
      }
    }

    expanded.push(elem)
  }

  return { expanded, seqs }
}
