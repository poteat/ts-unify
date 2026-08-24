/**
 * Keys that place a node in its tree and its source (the parent link
 * and the position), ignored by `deepEqual` and copied through by `sub`.
 */
export const POSITION_KEYS: ReadonlySet<string> = new Set([
  'parent',
  'loc',
  'range',
])
