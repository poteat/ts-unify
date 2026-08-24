import { isParam } from './is-param'
import Kinds from './kinds'
import type { Node } from './tree'

/**
 * Whether an identifier reads the name it spells: a key, a member name, a
 * binding, a label, an import or export name or a type position does not.
 *
 * @param id the identifier
 * @param parent the node holding it; none at the top of a tree
 */
export const isRead = (id: Node, parent: Node | undefined) =>
  !parent ||
  !(
    ((parent.type === 'Property' ||
      parent.type === 'PropertyDefinition' ||
      parent.type === 'MethodDefinition') &&
      parent.key === id &&
      !parent.computed) ||
    (parent.type === 'MemberExpression' &&
      parent.property === id &&
      !parent.computed) ||
    (parent.type === 'VariableDeclarator' && parent.id === id) ||
    (Kinds.FUNCTIONS.has(parent.type) && isParam(parent, id)) ||
    parent.type === 'ArrayPattern' ||
    parent.type === 'ObjectPattern' ||
    parent.type === 'RestElement' ||
    (parent.type === 'AssignmentPattern' && parent.left === id) ||
    (parent.type === 'CatchClause' && parent.param === id) ||
    parent.type === 'LabeledStatement' ||
    parent.type === 'BreakStatement' ||
    parent.type === 'ContinueStatement' ||
    parent.type === 'ImportSpecifier' ||
    parent.type === 'ImportDefaultSpecifier' ||
    parent.type === 'ImportNamespaceSpecifier' ||
    parent.type === 'ExportSpecifier' ||
    parent.type.startsWith('TS')
  )
