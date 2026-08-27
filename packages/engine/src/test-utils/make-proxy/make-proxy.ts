import { NODE } from '@ts-unify/core/internal'
import type { ProxyNode } from '@ts-unify/core/internal'

/**
 * A minimal pattern proxy for a test: a function carrying the given
 * descriptor under `NODE`, as the builder's proxies do.
 *
 * @param node the descriptor the proxy carries
 * @returns a function with the descriptor under `NODE`
 */
export const makeProxy = (node: ProxyNode): unknown =>
  Object.assign(function proxy() {}, { [NODE]: node })
