/**
 * A program of three return statements and one expression statement.
 */
export const THREE_RETURNS = {
  type: 'Program',
  name: 'p',

  body: [
    { type: 'ReturnStatement', argument: { type: 'Literal', value: 1 } },
    { type: 'ReturnStatement', argument: { type: 'Literal', value: 2 } },
    { type: 'ReturnStatement', argument: { type: 'Literal', value: 3 } },
    { type: 'ExpressionStatement', expression: { type: 'Literal', value: 4 } },
  ],
} as const
