import type { Path } from '../../path'
import type { MatchContext } from '../match-context'

/**
 * Where in the node a pattern value is being tried: the match it belongs
 * to, the path down to the position, and the property key it sits under.
 */
export type Cursor = {
  ctx: MatchContext

  path: Path

  /**
   * Under which property or array index the value sits; absent at the
   * root and inside a maybeBlock, where captures and seals do not re-key.
   */
  key?: string
}
