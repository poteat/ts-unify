import type { UnwrapFluent } from '@/ast/unwrap-fluent'

import type { CollapseCategories, Rehydrate } from './steps'

/**
 * Normalizes a captured value or template value for substitution: the
 * fluent wrapper off, the tag rehydrated, the node widened to its category.
 */
export type NormalizeCaptured<V> = CollapseCategories<
  Rehydrate<UnwrapFluent<V>>
>
