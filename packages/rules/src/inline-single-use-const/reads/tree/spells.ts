import type { Node } from './nodes'

/**
 * Whether a node is an identifier spelling a name.
 *
 * @param node the node
 * @param name the name
 * @returns true when the node is an `Identifier` of that name
 */
export const spells = (node: Node, name: string) =>
  node.type === 'Identifier' && node.name === name
