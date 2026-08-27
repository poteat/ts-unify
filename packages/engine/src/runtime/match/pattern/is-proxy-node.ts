import { NODE } from '@ts-unify/core/internal'
import SymGet from '@ts-unify/engine/runtime/sym-get'
/**
 * Whether a pattern value is a proxy node, such as `U.Identifier({ ... })`.
 *
 * @param v the pattern value
 * @returns true when it is a function carrying a `NODE` descriptor
 */
export const isProxyNode = (v: unknown) =>
  typeof v === 'function' && SymGet.symGet(v, NODE) != null
