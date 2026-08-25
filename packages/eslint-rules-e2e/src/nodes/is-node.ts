import type { Walked } from './types'

/**
 * Whether a value is a node: an object carrying a string `type`.
 *
 * @param value anything found under a node's keys
 */
export const isNode = (value: unknown): value is Walked =>
  typeof value === 'object' &&
  value !== null &&
  'type' in value &&
  typeof value.type === 'string'
