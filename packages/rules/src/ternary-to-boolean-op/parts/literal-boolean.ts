import { isLiteral } from './is-literal'

/**
 * The value of a boolean literal; `undefined` for any other node.
 *
 * @param e the node
 */
export function literalBoolean(e: unknown) {
  const value = isLiteral(e) ? e.value : undefined

  return typeof value === 'boolean' ? value : undefined
}
