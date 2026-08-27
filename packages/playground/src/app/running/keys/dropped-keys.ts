/**
 * The keys the AST view leaves out of a node: the parent link, which is
 * cyclic, and the tokens, comments and positions, which are noise.
 */
export const DROPPED_KEYS: ReadonlySet<string> = Object.freeze(
  new Set(['parent', 'tokens', 'comments', 'range', 'loc']),
)
