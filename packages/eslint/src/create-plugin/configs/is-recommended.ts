import { proxyNodeOf } from '@ts-unify/engine'
import type { TransformLike } from '@ts-unify/eslint/transform-like'

/**
 * Whether a transform's fluent chain carries `.recommended()`.
 *
 * @param transform a fluent pattern
 * @returns true when some chain entry is `.recommended()`
 */
export function isRecommended(transform: TransformLike) {
  const node = proxyNodeOf(transform)

  return node?.chain.some(c => c.method === 'recommended') ?? false
}
