/**
 * Type kinds that need parentheses as an array's element or a `keyof` or
 * `readonly` operand (`(string | undefined)[]`).
 */
export const COMPOUND_TYPES: ReadonlySet<string> = new Set([
  'TSUnionType',
  'TSIntersectionType',
  'TSFunctionType',
  'TSConstructorType',
  'TSConditionalType',
  'TSTypeOperator',
  'TSInferType',
])
