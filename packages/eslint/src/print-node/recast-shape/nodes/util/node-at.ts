/**
 * The node a key of a node holds, typed as one; undefined when the key is
 * empty.
 *
 * @param node the node
 * @param key the key, one that holds a node when it holds anything
 */
export const nodeAt = (node: Record<string, unknown>, key: string) =>
  node[key] as Record<string, unknown> | undefined
