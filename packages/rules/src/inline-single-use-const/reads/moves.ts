import Kinds from './kinds'
import type { Read } from './read'
import Tree from './tree'

/**
 * Whether putting the initializer at a read changes when it runs or how
 * the statement reads.
 *
 * True for a read in a nested function, a loop, a shorthand property or a
 * template literal's hole (a fragment keeps its name); and for an
 * initializer with effects, a read after another effect or under a branch.
 *
 * @param read the one read of the name
 * @param stmt the statement holding the read
 * @param init the initializer
 */
export function moves(read: Read, stmt: Tree.Node, init: Tree.Node) {
  const { node, above } = read
  const parent: Tree.Node | undefined = above[above.length - 1]
  if (parent?.type === 'Property' && parent.shorthand) return true
  if (parent?.type === 'TemplateLiteral') return true

  if (above.some(a => Kinds.FUNCTIONS.has(a.type) || Kinds.LOOPS.has(a.type)))
    return true

  if (![...Tree.walk(init)].some(([n]) => Kinds.EFFECTS.has(n.type)))
    return false
  const [start] = node.range as [number, number]

  for (const [n] of Tree.walk(stmt)) {
    if (n === node) continue
    if (Kinds.EFFECTS.has(n.type) && (n.range as [number, number])[1] <= start)
      return true
  }

  for (let i = 0; i < above.length; i++) {
    const a = above[i]
    const below = above[i + 1] ?? node
    if (a.type === 'LogicalExpression' && a.right === below) return true
    if (a.type === 'ConditionalExpression' && a.test !== below) return true
    if (a.type === 'IfStatement' && a.test !== below) return true
    if (a.type === 'ChainExpression') return true
    if (a.type === 'SwitchStatement' && a.discriminant !== below) return true
    if (a.type === 'TryStatement') return true
  }

  return false
}
