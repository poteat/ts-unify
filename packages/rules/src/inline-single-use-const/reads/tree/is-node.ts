import type { Node } from './node'

/**
 * Whether a value is a parser node: an object with a string `type`.
 *
 * @param v the value
 */
export const isNode = (v: unknown): v is Node =>
  typeof v === 'object' && v !== null && typeof (v as Node).type === 'string'
