import Util from './util'

/**
 * The color of a Monaco token type: the longest dotted prefix the table
 * names, else the default.
 *
 * @param tokenType the token's type, such as `string.escape.ts`
 */
export function tokenColor(tokenType: string) {
  const parts = tokenType.split('.')

  for (let length = parts.length; length > 0; length--) {
    const color = Util.TOKEN_COLORS[parts.slice(0, length).join('.')]
    if (color) return color
  }

  return Util.DEFAULT_COLOR
}
