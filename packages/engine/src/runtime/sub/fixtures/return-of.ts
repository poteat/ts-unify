/**
 * A `ReturnStatement` node.
 *
 * @param argument the node returned
 */
export const returnOf = (argument: unknown) => ({
  type: 'ReturnStatement',
  argument,
})
