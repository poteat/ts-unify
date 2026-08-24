import CommentNodes from '../../comment-nodes'
import type { Bag } from '../bag'
import Chain from '../chain'
import type { Cursor } from '../context'
import Node from '../node'
import Pattern from '../pattern'
import { matchInner } from './match-inner'
import { matchMaybeBlockInner } from './match-maybe-block-inner'
import { matchOrInner } from './match-or-inner'

/**
 * Matches a value against a proxy node pattern, such as
 * `U.Identifier({ ... })`, `U.or(...)` or `U.maybeBlock(...)`.
 *
 * An or tries its alternatives, a maybeBlock looks through a
 * one-statement block, and any other tag must be the value's type. The
 * chain's guards, seal, bind and `.to()` then apply to the captures.
 *
 * @param actual the value
 * @param expected the proxy node
 * @param at where the value sits in the match
 */
export function matchProxyNode(
  actual: unknown,
  expected: unknown,
  at: Cursor,
): Bag | null {
  const inner = Pattern.patternNodeOf(expected)
  const node =
    inner.tag === 'Comment' && Node.isRawComment(actual)
      ? CommentNodes.commentNodeOf(at.ctx.program, actual)
      : actual
  const innerBag =
    inner.tag === 'or'
      ? matchOrInner(node, inner.args, at)
      : inner.tag === 'maybeBlock'
        ? matchMaybeBlockInner(node, inner.args[0], {
            ctx: at.ctx,
            path: at.path,
          })
        : Node.nodeType(node) === inner.tag
          ? matchInner(node, inner.args[0] ?? {}, at)
          : null
  if (!innerBag) return null
  if (!Chain.applyWhenGuards(inner.chain, innerBag)) return null
  const bag = Chain.applyChainModifiers(inner.chain, innerBag, {
    node,
    key: at.key,
  })
  const factory = Chain.toFactory(inner.chain)
  if (factory) at.ctx.recordSite({ path: at.path, factory, scopeBag: bag })

  return bag
}
