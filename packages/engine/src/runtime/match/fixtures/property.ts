import { identifier } from './identifier'

/**
 * An ESTree `Property` node whose value is the identifier `v`.
 *
 * @param key the key node
 */
export const property = (key: unknown) => ({
  type: 'Property',
  key,
  value: identifier('v'),
})
