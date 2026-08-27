import Util from './util'
/**
 * Whether a value is a parser's comment, of type `Line` or `Block`; the
 * engine's `Comment` view of one has its own type.
 *
 * @param v the value
 * @returns true when its type is `Line` or `Block`
 */
export function isRawComment(v: unknown) {
  const t = Util.nodeType(v)

  return t === 'Line' || t === 'Block'
}
