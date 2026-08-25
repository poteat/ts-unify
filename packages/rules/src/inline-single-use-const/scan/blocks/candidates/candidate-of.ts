import Tree from '@ts-unify/rules/inline-single-use-const/reads/tree'

/**
 * The name and initializer of a statement that declares one const by a
 * bare identifier; null for any other statement.
 *
 * @param statement the statement
 */
export function candidateOf(
  statement: unknown,
): { name: string; init: Tree.Node } | null {
  if (
    !Tree.isNode(statement) ||
    statement.type !== 'VariableDeclaration' ||
    statement.kind !== 'const'
  ) {
    return null
  }

  const decls = statement.declarations

  if (!Array.isArray(decls) || decls.length !== 1 || !Tree.isNode(decls[0])) {
    return null
  }

  const { id, init } = decls[0]

  return Tree.isNode(id) &&
    id.type === 'Identifier' &&
    id.typeAnnotation === undefined &&
    Tree.isNode(init)
    ? { name: id.name as string, init }
    : null
}
