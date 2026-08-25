import type { RootLiteral } from '@engine/runtime/match/literals/types'
import Util from '@engine/runtime/match/literals/util'
import type { Plan } from '@engine/runtime/match/plan'
/**
 * The one root literal a `U.or` of literals, or of node proxies, amounts
 * to; null when its alternatives are of any other kind.
 *
 * An or of literals allows their values at its path; an or of node
 * proxies allows their tags at the `type` under it.
 *
 * @param alternatives the plans of the or's alternatives
 * @param path the path of the or under the node
 */
export function orLiteral(
  alternatives: readonly Plan[],
  path: readonly string[],
): RootLiteral | null {
  if (alternatives.every(it => it.kind === 'literal')) {
    return Util.literalAt(
      path,
      alternatives.map(it => (it.kind === 'literal' ? it.value : undefined)),
    )
  }

  const tags = alternatives.map(it =>
    it.kind === 'proxy' && it.body.shape === 'node' && it.tag !== 'Comment'
      ? it.tag
      : null,
  )

  return tags.every(it => it !== null)
    ? Util.literalAt([...path, 'type'], tags)
    : null
}
