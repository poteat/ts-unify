import { NODE } from './node'
import type { ProxyNode } from './proxy-node'
import { VALUES } from './values'

/**
 * Builds the proxy behind `U`; a read of `NODE` on it gives back the
 * descriptor.
 *
 * At the root, a property read names a node kind and a call records its
 * arguments; on a node, each read and call appends to the chain.
 *
 * @param node the descriptor built so far; none at the root
 */
export const makeProxy = (node?: ProxyNode): unknown =>
  new Proxy(function () {}, {
    get(_, prop) {
      if (prop === NODE) return node

      if (typeof prop === 'symbol') return undefined

      if (!node && prop in VALUES) return VALUES[prop]

      if (node) {
        const method = prop as string

        return (...args: unknown[]) =>
          makeProxy({
            ...node,

            chain: [
              ...node.chain,
              {
                method,
                args,
              },
            ],
          })
      }

      const tag = prop as string

      return (...args: unknown[]) =>
        makeProxy({
          tag,
          args,
          chain: [],
        })
    },

    apply(_, __, args) {
      return makeProxy({
        tag: '',
        args,
        chain: [],
      })
    },
  })
