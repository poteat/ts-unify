import { NODE } from '@ts-unify/core/internal'
import type { ProxyNode } from '@ts-unify/core/internal'
import SymGet from '@ts-unify/engine/runtime/sym-get'
/**
 * The tag, arguments and chain a pattern's proxy node carries; the caller
 * has checked {@link isProxyNode}.
 *
 * @param v a proxy node, as {@link isProxyNode} admits
 */
export const patternNodeOf = (v: unknown) => SymGet.symGet(v, NODE) as ProxyNode
