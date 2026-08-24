import SymGet from '../sym-get'

/**
 * Converts a proxy tree (or a real AST node) into a plain ESTree object,
 * the form recast's `print()` takes.
 *
 * @param value a proxy, a node, an array of either, or a primitive
 * @param sourceCode a source handle, reserved and not yet read
 */
export function reify(value: unknown, sourceCode?: unknown): unknown {
  const node = SymGet.proxyNodeOf(value)

  if (node) {
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
