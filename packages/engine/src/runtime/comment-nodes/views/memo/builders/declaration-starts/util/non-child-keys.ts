/**
 * Keys of a node that hold no child node: the parent link, the source
 * positions, and the program's comment and token lists.
 */
export const NON_CHILD_KEYS: ReadonlySet<string> = new Set([
  'parent',
  'loc',
  'range',
  'comments',
  'tokens',
])
