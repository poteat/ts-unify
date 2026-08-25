/**
 * Keys of a node the walk does not descend into: the parent link, the
 * positions, and the program's token and comment lists.
 */
export const SKIPPED_KEYS: ReadonlySet<string> = new Set([
  'parent',
  'loc',
  'range',
  'tokens',
  'comments',
])
