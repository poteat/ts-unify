import { isRead } from './is-read'
import type { Read } from './read'
import Tree from './tree'

/**
 * Every identifier under a tree that reads a name, each with the nodes
 * above it.
 *
 * @param tree the nodes searched
 * @param name the name
 */
export function readsOf(tree: unknown, name: string): Read[] {
  const found: Read[] = []

  function visit(t: unknown, above: Tree.Node[]): void {
    if (Array.isArray(t)) {
      for (const v of t) visit(v, above)

      return
    }

    if (!Tree.isNode(t)) return

    if (Tree.spells(t, name)) {
      if (isRead(t, above[above.length - 1])) found.push({ node: t, above })

      return
    }

    for (const v of Tree.children(t)) visit(v, [...above, t])
  }

  visit(tree, [])

  return found
}
