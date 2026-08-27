import TestUtils from '../../../test-utils'

/**
 * An ESTree `Property` node whose value is the identifier `v`.
 *
 * @param key the key node
 * @returns a `Property` node with the key and the identifier `v` as its value
 */
export const property = (key: unknown) => ({
  type: 'Property',
  key,
  value: TestUtils.identifier('v'),
})
