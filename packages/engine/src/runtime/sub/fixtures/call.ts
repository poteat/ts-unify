/**
 * The node of a call: a callee applied to arguments.
 *
 * @param callee the node called
 * @param args the argument nodes
 */
export const call = (callee: unknown, args: unknown[]) => ({
  type: 'CallExpression',
  callee,
  arguments: args,
})
