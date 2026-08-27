import { SPREAD_BRAND } from '@ts-unify/core/internal'

import Branded from './branded'
/**
 * Whether an array pattern element is a spread capture, such as `...$`:
 * an object branded `SPREAD_BRAND`.
 */
export const isSpread = Branded.brandedAs(SPREAD_BRAND)
