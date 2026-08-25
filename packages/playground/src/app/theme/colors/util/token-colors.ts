/**
 * The color of each Monaco token type the playground's own rendering
 * knows; a dotted type falls back to its prefixes.
 */
export const TOKEN_COLORS: Readonly<Record<string, string>> = {
  comment: '#545a69',
  keyword: '#8b8cf5',
  string: '#a8d08d',
  'string.escape': '#c9e0b0',
  'string.key': '#7dc4e4',
  regexp: '#a8d08d',
  number: '#e5b575',
  type: '#7dc4e4',
  identifier: '#cdd3dc',
  delimiter: '#767c8b',
  operator: '#b5bac2',
}
