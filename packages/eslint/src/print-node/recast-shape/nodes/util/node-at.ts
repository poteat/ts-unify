/**
 * The node a key of a node holds, typed as one; undefined when the key is
 * empty.
 *
 * @param node the node
 * @param key the key, one that holds a node when it holds anything
 * @returns the node under the key, or undefined when the key is empty
 */
export const nodeAt = (node: Record<string, unknown>, key: string) =>
  node[key] as Record<string, unknown> | undefined
