import type { Node } from '@ts-unify/rules/inline-single-use-const/reads/tree'

/**
 * Whether a node runs what it holds only on a branch.
 *
 * A logical expression's right side, a conditional's or an if's arms, an
 * optional chain, a switch case and a try are branches.
 *
 * @param node the node
 * @param below what it holds on the way down
 * @returns true when `below` runs only on a branch of the node
 */
export const isBranch = (node: Node, below: Node) =>
  (node.type === 'LogicalExpression' && node.right === below) ||
  (node.type === 'ConditionalExpression' && node.test !== below) ||
  (node.type === 'IfStatement' && node.test !== below) ||
  node.type === 'ChainExpression' ||
  (node.type === 'SwitchStatement' && node.discriminant !== below) ||
  node.type === 'TryStatement'
