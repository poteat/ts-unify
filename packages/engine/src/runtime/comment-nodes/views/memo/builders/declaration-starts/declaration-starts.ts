import type { TSESTree } from '@typescript-eslint/types'

import Util from './util'
/**
 * The outermost declaration starting at each start offset of a program.
 * Parents are visited before children, so the first writer wins.
 *
 * @param program the program walked
 * @returns a map from start offset to the outermost declaration starting there
 */
export function declarationStarts(
  program: unknown,
): ReadonlyMap<number, TSESTree.Node> {
  const starts = new Map<number, TSESTree.Node>()

  function visit(node: unknown): void {
    const rec = node as Record<string, unknown> | null
    if (!rec || typeof rec !== 'object' || typeof rec.type !== 'string') return
    const range = rec.range as TSESTree.Range | undefined

    if (range && Util.DECLARATIONS.has(rec.type) && !starts.has(range[0])) {
      starts.set(range[0], node as TSESTree.Node)
    }

    for (const key of Object.keys(rec)) {
      if (Util.NON_CHILD_KEYS.has(key)) continue
      const child = rec[key]
      Array.isArray(child) ? child.forEach(visit) : visit(child)
    }
  }

  visit(program)

  return starts
}
