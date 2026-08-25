import Kinds from '@ts-unify/rules/inline-single-use-const/reads/kinds'
import Tree from '@ts-unify/rules/inline-single-use-const/reads/tree'
import type {
  Frame,
  Suppressed,
} from '@ts-unify/rules/inline-single-use-const/scan/frames'
import type {
  Analysis,
  Tally,
} from '@ts-unify/rules/inline-single-use-const/scan/types'

import Merging from './merging'
import Ranges from './ranges'
import Records from './records'

/**
 * Adds every identifier under one statement of a block to the tallies,
 * and returns the earliest end of an effect under it (Infinity when none).
 *
 * A nested block is read through its own analysis, built once; an
 * identifier's own name is suppressed under it.
 *
 * @param statement the statement
 * @param index its index in the block
 * @param tallies the tallies, written to
 * @param of the analysis of a nested block
 */
export function tallyStatement(
  statement: unknown,
  index: number,
  tallies: Map<string, Tally>,
  of: (body: unknown[]) => Analysis,
): number {
  let minEffectEnd = Infinity

  function visit(
    value: unknown,
    up: Frame | null,
    suppressed: Suppressed | null,
  ) {
    if (Array.isArray(value)) {
      for (const item of value) visit(item, up, suppressed)

      return
    }

    if (!Tree.isNode(value)) return
    if (Kinds.EFFECTS.has(value.type))
      minEffectEnd = Math.min(minEffectEnd, Ranges.endOf(value))
    const frame = { node: value, up }

    if (value.type === 'BlockStatement' && Array.isArray(value.body)) {
      const nested = of(value.body)
      Merging.merge(tallies, nested, frame, index, suppressed)
      minEffectEnd = Math.min(minEffectEnd, nested.minEffectEnd)

      return
    }

    let below = suppressed

    if (value.type === 'Identifier') {
      Records.record(value, frame, index, tallies, suppressed)
      below = { name: value.name as string, up: suppressed }
    }

    for (const key of Object.keys(value)) {
      if (key !== 'parent' && key !== 'loc' && key !== 'range')
        visit(value[key], frame, below)
    }
  }

  visit(statement, null, null)

  return minEffectEnd
}
