/**
 * A node `TYPEOF_BINARY` matches.
 */
export const TYPEOF_NODE = {
  type: 'BinaryExpression',
  operator: '==',
  left: { type: 'UnaryExpression', operator: 'typeof' },
}
