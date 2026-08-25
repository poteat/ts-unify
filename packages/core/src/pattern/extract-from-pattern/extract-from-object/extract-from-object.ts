import type { CoalesceUnionOfBags } from '@/pattern/coalesce-union-of-bags'
import type { IntersectValues } from '@/pattern/intersect-values'

import type { ExtractFromValue } from './types'

/**
 * The `Token` bag of an object pattern: the bags of its property values
 * intersected into one.
 */
export type ExtractFromObject<P, Token> = {
  [K in keyof P]-?: CoalesceUnionOfBags<ExtractFromValue<P[K], Token>>
} extends infer M
  ? IntersectValues<M>
  : never
