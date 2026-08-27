/**
 * The value a path leads to under a node; undefined past anything that is
 * not an object, where a match fails.
 *
 * @param node the node
 * @param path the property keys and array indices, outermost first
 * @returns what sits at the end of the path, or undefined past a non-object
 */
export function valueAt(node: unknown, path: readonly string[]): unknown {
  let value = node

  for (const key of path) {
    if (value === null || typeof value !== 'object') return undefined
    value = (value as Record<string, unknown>)[key]
  }

  return value
}
