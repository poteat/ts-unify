/**
 * A function declaration named `f` whose body is one return statement.
 *
 * @param argument the returned node
 */
export const returning = (argument: unknown) => ({
  type: 'FunctionDeclaration',
  name: 'f',

  body: {
    type: 'BlockStatement',
    body: [{ type: 'ReturnStatement', argument }],
  },
})
