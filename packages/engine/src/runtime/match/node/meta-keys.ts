/**
 * The keys of a node that carry no structure: the parent link and the
 * source positions. Captures, equality and subtree walks leave them out.
 */
export const META_KEYS: ReadonlySet<string> = new Set([
  'parent',
  'loc',
  'range',
])
