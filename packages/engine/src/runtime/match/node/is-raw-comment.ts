import { nodeType } from './node-type'

/**
 * Whether a value is a parser's comment, of type `Line` or `Block`; the
 * engine's `Comment` view of one has its own type.
 *
 * @param v the value
 */
export function isRawComment(v: unknown) {
  const t = nodeType(v)

  return t === 'Line' || t === 'Block'
}
