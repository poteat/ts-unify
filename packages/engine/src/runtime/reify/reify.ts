import { NODE } from '@ts-unify/core/internal'
import type { ProxyNode } from '@ts-unify/core/internal'

import SymGet from '../sym-get'

/**
 * Convert a proxy tree (or real AST node) into a plain ESTree object
 * suitable for recast's `print()`.
 */
export function reify(value: unknown, sourceCode?: unknown): unknown {
  if (typeof value === 'function' && SymGet.symGet(value, NODE)) {
    const node = SymGet.symGet(value, NODE) as ProxyNode
    const args = node.args[0] ?? ({} as Record<string, unknown>)

    const result: Record<string, unknown> = {
      type: node.tag,
    }

    for (const [k, v] of Object.entries(args)) {
      if (k === 'type') continue

      result[k] = reify(v, sourceCode)
    }

    return result
  }

  return Array.isArray(value)
    ? value.map((v: unknown) => reify(v, sourceCode))
    : value
}
