import type { Named } from '@ts-unify/engine/runtime/match/types'
import SymGet from '@ts-unify/engine/runtime/sym-get'
/**
 * A test of a pattern value for a brand: whether it is an object
 * carrying the brand's symbol as true.
 *
 * @param brand the brand's symbol
 * @returns whether a value is an object branded so
 */
export const brandedAs =
  (brand: symbol) =>
  (v: unknown): v is Named =>
    v != null && typeof v === 'object' && SymGet.symGet(v, brand) === true
