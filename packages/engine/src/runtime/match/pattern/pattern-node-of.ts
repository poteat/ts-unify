import SymGet from '@engine/runtime/sym-get'
import { NODE } from '@ts-unify/core/internal'
import type { ProxyNode } from '@ts-unify/core/internal'
/**
 * The tag, arguments and chain a pattern's proxy node carries; the caller
 * has checked {@link isProxyNode}.
 *
 * @param v a proxy node, as {@link isProxyNode} admits
 */
export const patternNodeOf = (v: unknown) => SymGet.symGet(v, NODE) as ProxyNode
