import { NODE } from '@ts-unify/core/internal'
import type { ProxyNode } from '@ts-unify/core/internal'

import Symbols from './symbols'
/**
 * The `ProxyNode` descriptor a pattern proxy carries under `NODE`, or
 * undefined when the value is no proxy.
 *
 * @param value a value that may be a pattern proxy
 */
export const proxyNodeOf = (value: unknown): ProxyNode | undefined =>
  typeof value === 'function'
    ? (Symbols.symGet(value, NODE) as ProxyNode | undefined)
    : undefined
