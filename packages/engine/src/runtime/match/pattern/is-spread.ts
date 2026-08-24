import { SPREAD_BRAND } from '@ts-unify/core/internal'

import SymGet from '../../sym-get'

/**
 * Whether an array pattern element is a spread capture, such as `...$`.
 *
 * @param v the element
 */
export const isSpread = (v: unknown): v is { name: string } =>
  v != null && typeof v === 'object' && SymGet.symGet(v, SPREAD_BRAND) === true
