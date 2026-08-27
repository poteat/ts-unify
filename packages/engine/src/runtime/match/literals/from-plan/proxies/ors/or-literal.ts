import type { RootLiteral } from '@ts-unify/engine/runtime/match/literals/types'
import Util from '@ts-unify/engine/runtime/match/literals/util'
import type { Plan } from '@ts-unify/engine/runtime/match/plan'
/**
 * The one root literal a `U.or` of literals, or of node proxies, amounts
 * to; null when its alternatives are of any other kind.
 *
 * An or of literals allows their values at its path; an or of node
 * proxies allows their tags at the `type` under it.
 *
 * @param alternatives the plans of the or's alternatives
 * @param path the path of the or under the node
 * @returns a literal at the path allowing the values, one at `type` allowing
 *          the tags, or null
 */
export function orLiteral(
  alternatives: readonly Plan[],
  path: readonly string[],
): RootLiteral | null {
  const isAllLiteral = alternatives.every(it => it.kind === 'literal')

  if (isAllLiteral) {
    return Util.literalAt(
      path,
      alternatives.map(it => (it.kind === 'literal' ? it.value : undefined)),
    )
  }

  const tags = alternatives.map(it => {
    const isNodeProxy =
      it.kind === 'proxy' && it.body.shape === 'node' && it.tag !== 'Comment'

    return isNodeProxy ? it.tag : null
  })

  const isAllNodeProxy = tags.every(it => it !== null)

  return isAllNodeProxy ? Util.literalAt([...path, 'type'], tags) : null
}
