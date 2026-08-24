/**
 * The node of `[myArr]` in `const x = [myArr];`.
 */
export const ARRAY_NODE = {
  type: 'ArrayExpression',
  elements: [{ type: 'Identifier', name: 'myArr' }],
  range: [10, 25],
} as const
