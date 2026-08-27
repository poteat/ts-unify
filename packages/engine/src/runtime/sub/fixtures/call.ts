/**
 * The node of a call: a callee applied to arguments.
 *
 * @param callee the node called
 * @param args the argument nodes
 * @returns a `CallExpression` node of the callee and arguments
 */
export const call = (callee: unknown, args: unknown[]) => ({
  type: 'CallExpression',
  callee,
  arguments: args,
})
