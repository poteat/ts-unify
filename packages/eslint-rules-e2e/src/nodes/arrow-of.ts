/**
 * An ArrowFunctionExpression with an expression body.
 *
 * @param params the parameters
 * @param body the expression returned
 */
export const arrowOf = (params: unknown[], body: unknown) => ({
  type: 'ArrowFunctionExpression',
  params,
  body,
})
