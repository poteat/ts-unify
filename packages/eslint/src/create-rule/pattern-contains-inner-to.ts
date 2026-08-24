import { NODE } from '@ts-unify/core/internal'
import type { ProxyNode } from '@ts-unify/core/internal'
import { symGet } from '@ts-unify/engine'

import type { Candidate } from './visitors'

/**
 * Whether any pattern entry contains a proxy with `.to()` anywhere.
 *
 * @param entries the rule's entry patterns
 */
export function patternContainsInnerTo(entries: readonly Candidate[]) {
  function walk(v: unknown): boolean {
    if (v == null) return false

    if (typeof v === 'function' && symGet(v, NODE)) {
      const pn = symGet(v, NODE) as ProxyNode

      return pn.chain.some(c => c.method === 'to') ? true : pn.args.some(walk)
    }

    return (
      typeof v === 'object' &&
      (Array.isArray(v)
        ? v.some(walk)
        : Object.values(v as Record<string, unknown>).some(walk))
    )
  }

  return entries.some(e => walk(e.pattern))
}
