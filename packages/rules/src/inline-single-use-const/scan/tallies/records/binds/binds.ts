import Bindings from '@ts-unify/rules/inline-single-use-const/reads/bindings'
import Kinds from '@ts-unify/rules/inline-single-use-const/reads/kinds'
import type { Node } from '@ts-unify/rules/inline-single-use-const/reads/tree'

/**
 * Whether an identifier is bound where it stands.
 *
 * A declarator's name, a function's name or parameter, a pattern element,
 * a default's left side and a catch parameter are bindings.
 *
 * @param id the identifier
 * @param parent the node holding it
 * @param grandparent the node holding that one; none above a statement
 * @returns true when the identifier is bound where it stands
 */
export const binds = (id: Node, parent: Node, grandparent: Node | undefined) =>
  Bindings.isDirectBinding(parent, id) ||
  (Kinds.FUNCTIONS.has(parent.type) &&
    (parent.id === id || Bindings.isParam(parent, id))) ||
  parent.type === 'ArrayPattern' ||
  parent.type === 'RestElement' ||
  (parent.type === 'Property' &&
    parent.value === id &&
    grandparent?.type === 'ObjectPattern' &&
    Array.isArray(grandparent.properties) &&
    grandparent.properties.includes(parent))
