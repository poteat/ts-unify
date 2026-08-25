import SymGet from '@engine/runtime/sym-get'
import { NODE } from '@ts-unify/core/internal'
/**
 * Whether a pattern value is a proxy node, such as `U.Identifier({ ... })`.
 *
 * @param v the pattern value
 */
export const isProxyNode = (v: unknown) =>
  typeof v === 'function' && SymGet.symGet(v, NODE) != null
