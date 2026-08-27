import { commentNodes } from '@ts-unify/engine'

import type { Parented } from './types'
import Util from './util'
/**
 * Every node of a program in visit order, as the ESLint adapter visits
 * them.
 *
 * Parents come before children and each node's `parent` is set as
 * ESLint sets it; the program's `Comment` nodes come after the rest.
 *
 * @param program the `Program` node
 * @returns the program's nodes in visit order, its comments last
 */
export function walkNodes(program: unknown): object[] {
  const nodes: object[] = []

  function visit(node: unknown, parent: unknown) {
    if (!Util.isNode(node)) return
    ;(node as Parented).parent = parent
    nodes.push(node)

    for (const key of Object.keys(node)) {
      if (Util.SKIPPED_KEYS.has(key)) continue
      const child = (node as Record<string, unknown>)[key]

      if (Array.isArray(child)) {
        for (const item of child) visit(item, node)
      } else {
        visit(child, node)
      }
    }
  }

  visit(program, undefined)

  for (const comment of commentNodes(program)) nodes.push(comment)

  return nodes
}
