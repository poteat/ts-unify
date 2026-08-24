import Reads from './reads'
import Tree from './reads/tree'

/**
 * The first const of a block that one read in the very next statement
 * consumes, with that read; null when there is none.
 *
 * Exported so a wrapper can see which const a report is about.
 *
 * @param body the block's statements
 */
export function inlinableConst(
  body: unknown,
): { index: number; name: string; init: Tree.Node; read: Tree.Node } | null {
  if (!Array.isArray(body)) return null

  for (let i = 0; i + 1 < body.length; i++) {
    const s = body[i]
    if (
      !Tree.isNode(s) ||
      s.type !== 'VariableDeclaration' ||
      s.kind !== 'const'
    )
      continue
    const decls = s.declarations
    if (!Array.isArray(decls) || decls.length !== 1 || !Tree.isNode(decls[0]))
      continue
    const d = decls[0]
    const id = d.id
    const init = d.init
    if (
      !Tree.isNode(id) ||
      id.type !== 'Identifier' ||
      id.typeAnnotation !== undefined ||
      !Tree.isNode(init)
    )
      continue
    const name = id.name as string
    const rest = body.slice(i + 1)
    if (Reads.rebinds(rest, name) || Reads.namedInType(rest, name)) continue
    const reads = Reads.readsOf(rest, name)
    if (reads.length !== 1) continue
    const stmt = body[i + 1]
    const [read] = reads
    if (!Tree.isNode(stmt) || Reads.readsOf(stmt, name).length !== 1) continue
    if (Reads.moves(read, stmt, init)) continue

    return { index: i, name, init, read: read.node }
  }

  return null
}
