/**
 * An ArrowFunctionExpression with an expression body.
 *
 * @param params the parameters
 * @param body the expression returned
 * @returns an `ArrowFunctionExpression` node with those params and body
 */
export const arrowOf = (params: unknown[], body: unknown) => ({
  type: 'ArrowFunctionExpression',
  params,
  body,
})
