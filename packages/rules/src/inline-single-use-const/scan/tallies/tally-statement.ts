import Kinds from '../../reads/kinds'
import Tree from '../../reads/tree'
import type { Analysis } from '../analysis'
import type { Frame, Suppressed } from '../frames'
import { endOf } from './end-of'
import { merge } from './merge'
import { record } from './record'
import type { Tally } from './tally'

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
      minEffectEnd = Math.min(minEffectEnd, endOf(value))
    const frame = { node: value, up }

    if (value.type === 'BlockStatement' && Array.isArray(value.body)) {
      const nested = of(value.body)
      merge(tallies, nested, frame, index, suppressed)
      minEffectEnd = Math.min(minEffectEnd, nested.minEffectEnd)

      return
    }

    let below = suppressed

    if (value.type === 'Identifier') {
      record(value, frame, index, tallies, suppressed)
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
