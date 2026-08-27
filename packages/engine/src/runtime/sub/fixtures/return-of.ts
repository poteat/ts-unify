/**
 * A `ReturnStatement` node.
 *
 * @param argument the node returned
 * @returns a `ReturnStatement` node returning the argument
 */
export const returnOf = (argument: unknown) => ({
  type: 'ReturnStatement',
  argument,
})
