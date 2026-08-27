import Patterns from './patterns'
import Rewrites from './rewrites'

/**
 * An empty array filled by a push after a `continue` inside a
 * `for...of` is one `filter().map()` chain over the source.
 *
 * The filter keeps what the skip let through: `!c`, or `p` for a skip
 * on `!p`; the consts bound before the push are kept in the map's
 * callback, and anything else there keeps the loop.
 *
 * @example `for (const x of xs) { if (!p(x)) continue; out.push(f(x)) }`
 * becomes `const out = xs.filter(x => p(x)).map(x => f(x))`
 */
export const skippedForPushToFilterMap = Patterns.skippedBlock
  .when(bag => Rewrites.isConsts(bag.consts))
  .to(({ skipped, ...loop }) =>
    Rewrites.filterMap({ ...loop, test: Rewrites.negated(skipped) }),
  )
  .message('Replace for-loop with continue and push with filter().map()')
