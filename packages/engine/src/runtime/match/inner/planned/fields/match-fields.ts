import Context from '@engine/runtime/match/context'
import ArrayPattern from '@engine/runtime/match/inner/array-pattern'
import Proxies from '@engine/runtime/match/inner/planned/proxies'
import Util from '@engine/runtime/match/inner/util'
import type { FieldsPlan } from '@engine/runtime/match/plan'
import type { Bag } from '@engine/runtime/types'
/**
 * Matches a node against the plan of a fields record, one property at a
 * time, and returns the captures, or null on mismatch.
 *
 * A record written with `{ ...$ }` also captures the properties it did
 * not name.
 *
 * @param node the node
 * @param plan the plan of the fields record
 * @param at where the node sits in the match
 */
export function matchFields(
  node: unknown,
  plan: FieldsPlan,
  at: Context.Cursor,
): Bag | null {
  if (node === null || typeof node !== 'object') return null
  const bag: Bag = {}
  const nodeRec = node as Record<string, unknown>

  for (const { key, plan: expected } of plan.fields) {
    const actual = nodeRec[key]

    switch (expected.kind) {
      case 'dollar':
        bag[key] = actual
        at.ctx.capturePaths[key] = [...at.path, key]
        continue
      case 'capture':
        bag[expected.name] = actual
        at.ctx.bind(expected.name, actual)
        at.ctx.capturePaths[expected.name] = [...at.path, key]
        continue
      case 'config':
        if (actual !== at.ctx.configDefaults[expected.name]) return null
        continue
      case 'string':
        if (!expected.test(actual)) return null
        continue
      case 'proxy':
        if (
          !Util.absorb(
            bag,
            Proxies.matchProxyPlan(
              actual,
              expected,
              Context.childCursor(at, key),
            ),
          )
        )
          return null
        continue
      case 'fields':
        if (
          !Util.absorb(
            bag,
            matchFields(actual, expected, Context.childCursor(at, key)),
          )
        )
          return null
        continue
      case 'array':
        if (!Array.isArray(actual)) return null
        if (
          !Util.absorb(
            bag,
            ArrayPattern.matchArrayPlan(
              actual,
              expected,
              Context.childCursor(at, key),
            ),
          )
        )
          return null
        continue
      case 'literal':
        if (actual !== expected.value) return null
    }
  }

  return plan.named
    ? { ...bag, ...Context.captureRest(node, at, plan.named) }
    : bag
}
