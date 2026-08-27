import Context from '@ts-unify/engine/runtime/match/context'
import type { Cursor } from '@ts-unify/engine/runtime/match/context'
import Fields from '@ts-unify/engine/runtime/match/inner/planned/fields'
import type { NodeBody } from '@ts-unify/engine/runtime/match/plan'
import type { Bag } from '@ts-unify/engine/runtime/types'
/**
 * Matches a node of the plan's own type against the body's fields: a
 * bare `$` captures the node whole, a fields plan matches field by field.
 *
 * @param node the value, already of the plan's type
 * @param body the node-shaped body of the proxy plan
 * @param at where the value sits in the match
 * @returns the captures, or null when a field does not match
 */
export function matchNodePlan(
  node: unknown,
  body: NodeBody,
  at: Cursor,
): Bag | null {
  const fields = body.fields
  const isDollar = fields.kind === 'dollar'

  return isDollar
    ? Context.captureRest(node, at, Context.NO_KEYS)
    : Fields.matchFields(node, fields, at)
}
