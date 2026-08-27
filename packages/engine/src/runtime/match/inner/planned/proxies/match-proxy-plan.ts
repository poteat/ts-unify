import CommentNodes from '@ts-unify/engine/runtime/comment-nodes'
import Bags from '@ts-unify/engine/runtime/match/bags'
import type { Cursor } from '@ts-unify/engine/runtime/match/context'
import Node from '@ts-unify/engine/runtime/match/node'
import type { ProxyPlan } from '@ts-unify/engine/runtime/match/plan'
import type { Bag } from '@ts-unify/engine/runtime/types'

import Blocks from './blocks'
import Nodes from './nodes'
import Ors from './ors'
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
 * @returns the bag after the chain's guards, bind or seal, or null on mismatch
 *          or a failed guard
 */
export function matchProxyPlan(
  actual: unknown,
  plan: ProxyPlan,
  at: Cursor,
): Bag | null {
  const isRawComment = plan.tag === 'Comment' && Node.isRawComment(actual)
  const node = isRawComment
    ? CommentNodes.commentNodeOf(at.ctx.program, actual)
    : actual
  const body = plan.body
  const isOr = body.shape === 'or'
  const isMaybeBlock = body.shape === 'maybeBlock'
  const isSameType = Node.nodeType(node) === plan.tag
  const innerBag = isOr
    ? Ors.matchOrPlans(node, body.alternatives, at)
    : isMaybeBlock
      ? Blocks.matchMaybeBlockPlan(node, body.statement, {
          ctx: at.ctx,
          path: at.path,
        })
      : isSameType
        ? Nodes.matchNodePlan(node, body, at)
        : null
  if (!innerBag) return null
  const chain = plan.chain

  for (const guard of chain.whens) {
    if (!guard(innerBag)) return null
  }

  const key = at.key
  const isSealedUnderKey = chain.seal && key !== undefined
  const bag = chain.bind
    ? { [chain.bind.name ?? key ?? 'node']: node }
    : isSealedUnderKey
      ? Bags.sealed(innerBag, key)
      : innerBag

  if (chain.factory) {
    at.ctx.recordSite({ path: at.path, factory: chain.factory, scopeBag: bag })
  }

  return bag
}
