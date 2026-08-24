import CommentNodes from '../../../comment-nodes'
import type { Bag } from '../../bag'
import Context from '../../context'
import type { Cursor } from '../../context'
import Node from '../../node'
import Plan from '../../plan'
import type { ProxyPlan } from '../../plan'
import { matchFields } from './match-fields'
import { matchMaybeBlockPlan } from './match-maybe-block-plan'
import { matchOrPlans } from './match-or-plans'

/**
 * Matches a value against the plan of a proxy node, and returns the
 * captures, or null on mismatch.
 *
 * A raw comment under the match's program is seen through its node view.
 * The chain's guards, seal, bind and `.to()` then apply to the captures.
 *
 * @param actual the value
 * @param plan the plan of the proxy node
 * @param at where the value sits in the match
 */
export function matchProxyPlan(
  actual: unknown,
  plan: ProxyPlan,
  at: Cursor,
): Bag | null {
  const node =
    plan.tag === 'Comment' && Node.isRawComment(actual)
      ? CommentNodes.commentNodeOf(at.ctx.program, actual)
      : actual
  const body = plan.body
  const innerBag =
    body.shape === 'or'
      ? matchOrPlans(node, body.alternatives, at)
      : body.shape === 'maybeBlock'
        ? matchMaybeBlockPlan(node, body.statement, {
            ctx: at.ctx,
            path: at.path,
          })
        : Node.nodeType(node) !== plan.tag
          ? null
          : body.fields.kind === 'dollar'
            ? Context.captureRest(node, at, Context.NO_KEYS)
            : matchFields(node, body.fields, at)
  if (!innerBag) return null
  const chain = plan.chain

  for (const guard of chain.whens) {
    if (!guard(innerBag)) return null
  }

  const bag = chain.bind
    ? { [chain.bind.name ?? at.key ?? 'node']: node }
    : chain.seal && at.key
      ? Plan.sealed(innerBag, at.key)
      : innerBag

  if (chain.factory) {
    at.ctx.recordSite({ path: at.path, factory: chain.factory, scopeBag: bag })
  }

  return bag
}
