/**
 * Whether a value is an AST node: an object with a string `type`.
 *
 * @param value the value
 */
export const isNode = (value: unknown): value is { type: string } =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as { type?: unknown }).type === 'string'
