import type { Node } from '../tree'

/**
 * Whether a node binds an identifier outright: a declarator's name, a
 * default's left side or a catch parameter.
 *
 * A pattern element or a function's parameter is bound through the
 * pattern or the function.
 *
 * @param parent the node holding the identifier
 * @param id the identifier
 */
export const isDirectBinding = (parent: Node, id: Node) =>
  (parent.type === 'VariableDeclarator' && parent.id === id) ||
  (parent.type === 'AssignmentPattern' && parent.left === id) ||
  (parent.type === 'CatchClause' && parent.param === id)
