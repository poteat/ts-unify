import Descendants from './descendants'
import Util from './util'
/**
 * How many of a node and its descendants match a constraint, at most the
 * limit.
 *
 * A node matches at most once, an or-pattern's alternatives tried in
 * order; the descent stops under a boundary node, which is itself still
 * checked.
 */
export const countDescendant = Util.counted(Descendants.countDescendantOf)
