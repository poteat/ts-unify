import { isParam } from './is-param'
import Kinds from './kinds'
import Tree from './tree'

/**
 * Whether a same-named binding is made anywhere under a tree.
 *
 * A declarator, a function's name or parameter, a pattern element, a
 * default's left side and a catch parameter bind.
 *
 * @param tree the nodes searched
 * @param name the name
 */
export function rebinds(tree: unknown, name: string) {
  const nodes = [...Tree.walk(tree)]

  const inPattern = (property: Tree.Node) =>
    nodes.some(
      ([m]) =>
        m.type === 'ObjectPattern' &&
        Array.isArray(m.properties) &&
        m.properties.includes(property),
    )

  return nodes.some(
    ([n, parent]) =>
      Tree.spells(n, name) &&
      parent !== null &&
      ((parent.type === 'VariableDeclarator' && parent.id === n) ||
        (Kinds.FUNCTIONS.has(parent.type) &&
          (parent.id === n || isParam(parent, n))) ||
        parent.type === 'ArrayPattern' ||
        parent.type === 'RestElement' ||
        (parent.type === 'Property' &&
          parent.value === n &&
          inPattern(parent)) ||
        (parent.type === 'AssignmentPattern' && parent.left === n) ||
        (parent.type === 'CatchClause' && parent.param === n)),
  )
}
