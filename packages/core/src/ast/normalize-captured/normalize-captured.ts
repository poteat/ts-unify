import type { UnwrapFluent } from '@/ast/unwrap-fluent'

import type { CollapseCategories } from './collapse-categories'
import type { Rehydrate } from './rehydrate'

/**
 * Normalizes a captured value or template value for substitution: the
 * fluent wrapper off, the tag rehydrated, the node widened to its category.
 */
export type NormalizeCaptured<V> = CollapseCategories<
  Rehydrate<UnwrapFluent<V>>
>
