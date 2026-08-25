/**
 * Keys a clone leaves out: the parent link, the source positions and
 * the program's token and comment lists, none of them structure.
 */
export const METADATA_KEYS: ReadonlySet<string> = new Set([
  'parent',
  'loc',
  'range',
  'tokens',
  'comments',
])
