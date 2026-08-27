import Children from './children'
import Util from './util'
/**
 * How many descendants of a node match a constraint, the node itself not
 * counted; stops once the count reaches the limit.
 */
export const countChildren = Util.counted(Children.countChildrenOf)
