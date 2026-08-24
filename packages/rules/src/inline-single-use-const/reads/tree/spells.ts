import type { Node } from './node'

/**
 * Whether a node is an identifier spelling a name.
 *
 * @param node the node
 * @param name the name
 */
export const spells = (node: Node, name: string) =>
  node.type === 'Identifier' && node.name === name
