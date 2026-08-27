import Tree from '@ts-unify/rules/inline-single-use-const/reads/tree'

import type Types from './types'

/**
 * The name and initializer of a statement that declares one const by a
 * bare identifier; null for any other statement.
 *
 * @param statement the statement
 * @returns the const's name and initializer node, or null
 */
export function candidateOf(statement: unknown): Types.Candidate | null {
  const isConstDeclaration =
    Tree.isNode(statement) &&
    statement.type === 'VariableDeclaration' &&
    statement.kind === 'const'

  if (!isConstDeclaration) return null

  const decls = statement.declarations

  if (!Array.isArray(decls) || decls.length !== 1 || !Tree.isNode(decls[0])) {
    return null
  }

  const { id, init } = decls[0]
  const isBareIdentifierDeclarator =
    Tree.isNode(id) &&
    id.type === 'Identifier' &&
    id.typeAnnotation === undefined &&
    Tree.isNode(init)

  return isBareIdentifierDeclarator ? { name: id.name as string, init } : null
}
