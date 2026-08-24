/**
 * A BlockStatement of one statement under the given parent.
 *
 * @param parent the node the block sits in
 * @param statement the block's one statement
 */
export const blockOf = <S>(parent: { type: string }, statement: S) => ({
  type: 'BlockStatement',
  parent,
  body: [statement],
})
