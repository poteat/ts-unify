import type Types from './types'

/**
 * A BlockStatement of one statement under the given parent.
 *
 * @param parent the node the block sits in
 * @param statement the block's one statement
 * @returns a `BlockStatement` node holding the statement, its `parent` set
 */
export const blockOf = <S>(parent: Types.Walked, statement: S) => ({
  type: 'BlockStatement',
  parent,
  body: [statement],
})
