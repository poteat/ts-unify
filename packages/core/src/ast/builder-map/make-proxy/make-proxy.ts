import type { ProxyNode } from './types'
import Util from './util'

/**
 * Builds the proxy behind `U`; a read of `NODE` on it gives back the
 * descriptor.
 *
 * At the root, a property read names a node kind and a call records its
 * arguments; on a node, each read and call appends to the chain.
 *
 * @param node the descriptor built so far; none at the root
 * @returns a callable proxy; `NODE` reads the descriptor, any other read or
 *          call gives a proxy one step deeper
 */
export const makeProxy = (node?: ProxyNode): unknown =>
  new Proxy(function () {}, {
    get(_, prop) {
      if (prop === Util.NODE) return node

      if (typeof prop === 'symbol') return undefined

      if (!node && prop in Util.VALUES) return Util.VALUES[prop]

      if (node) {
        const method = prop

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

      const tag = prop

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
