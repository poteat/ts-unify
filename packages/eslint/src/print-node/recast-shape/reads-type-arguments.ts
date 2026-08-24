/**
 * Kinds where recast already reads `typeArguments` and would print both.
 */
export const READS_TYPE_ARGUMENTS: ReadonlySet<string> = new Set([
  'CallExpression',
  'OptionalCallExpression',
  'NewExpression',
])
