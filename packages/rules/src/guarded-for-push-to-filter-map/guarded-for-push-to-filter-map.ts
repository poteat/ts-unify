import Patterns from './patterns'
import Rewrites from './rewrites'

/**
 * An empty array filled by a guarded push inside a `for...of` is one
 * `filter().map()` chain over the source.
 *
 * The guard is an `if` around the push; the consts bound before the
 * push are kept in the map's callback, and anything else there keeps
 * the loop. `skippedForPushToFilterMap` reads the `continue` form.
 *
 * @example `for (const x of xs) if (p(x)) out.push(f(x))` becomes
 * `const out = xs.filter(x => p(x)).map(x => f(x))`
 */
export const guardedForPushToFilterMap = Patterns.guardedBlock
  .when(bag => Rewrites.isConsts(bag.consts))
  .to(({ condition, ...loop }) =>
    Rewrites.filterMap({ ...loop, test: condition }),
  )
  .message('Replace guarded for-loop with push with filter().map()')
