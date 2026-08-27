import Literals from './literals'

/**
 * The value of a boolean literal; `undefined` for any other node.
 *
 * @param e the node
 * @returns the literal's boolean value, or undefined
 */
export function literalBoolean(e: unknown) {
  const value = Literals.isLiteral(e) ? e.value : undefined

  return typeof value === 'boolean' ? value : undefined
}
