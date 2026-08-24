import { NODE } from '@ts-unify/core/internal'
import type { ProxyNode } from '@ts-unify/core/internal'

import SymGet from '../../sym-get'

/**
 * The tag, arguments and chain a proxy node carries.
 *
 * @param v a proxy node, as {@link isProxyNode} admits
 */
export const proxyNodeOf = (v: unknown) => SymGet.symGet(v, NODE) as ProxyNode
