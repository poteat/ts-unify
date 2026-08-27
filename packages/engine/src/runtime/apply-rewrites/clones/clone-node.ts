import Util from '@ts-unify/engine/runtime/apply-rewrites/util'
import Sub from '@ts-unify/engine/runtime/sub'
/**
 * A deep copy of an AST node without its `METADATA_KEYS`, safe to
 * mutate and to serialize.
 *
 * @param node the node copied; arrays and primitives pass through
 * @returns the copy, arrays mapped element by element and leaves passed through
 */
export function cloneNode(node: unknown): unknown {
  if (Array.isArray(node)) return node.map(cloneNode)
  if (Sub.isLeaf(node)) return node
  const copy: Record<string, unknown> = {}

  for (const key of Object.keys(node as Record<string, unknown>)) {
    if (Util.METADATA_KEYS.has(key)) continue
    copy[key] = cloneNode((node as Record<string, unknown>)[key])
  }

  return copy
}
