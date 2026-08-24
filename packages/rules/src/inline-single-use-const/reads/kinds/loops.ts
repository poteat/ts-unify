/**
 * The node kinds that are a loop.
 */
export const LOOPS: ReadonlySet<string> = new Set([
  'ForStatement',
  'ForInStatement',
  'ForOfStatement',
  'WhileStatement',
  'DoWhileStatement',
])
