/**
 * Keys that are not children: skipped when copying a node for printing.
 */
export const NON_CHILD_KEYS: ReadonlySet<string> = new Set([
  'parent',
  'loc',
  'range',
  'tokens',
  'comments',
])
