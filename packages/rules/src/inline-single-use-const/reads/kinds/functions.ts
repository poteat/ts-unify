/**
 * The node kinds that are a function, of any syntax.
 */
export const FUNCTIONS: ReadonlySet<string> = new Set([
  'ArrowFunctionExpression',
  'FunctionExpression',
  'FunctionDeclaration',
])
