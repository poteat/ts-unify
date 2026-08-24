import { NODE } from '@ts-unify/core/internal'
import type { ProxyNode } from '@ts-unify/core/internal'
import { symGet } from '@ts-unify/engine'

import type { TransformLike } from '../transform-like'

/**
 * Whether a transform's fluent chain carries `.recommended()`.
 *
 * @param transform a fluent pattern
 */
export function isRecommended(transform: TransformLike) {
  const node = symGet(transform, NODE) as ProxyNode | undefined

  return node?.chain.some(c => c.method === 'recommended') ?? false
}
