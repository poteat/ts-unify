import type { TSESTree } from '@typescript-eslint/types'

import { DECLARATIONS } from './declarations'
import { NON_CHILD_KEYS } from './non-child-keys'

/**
 * The outermost declaration starting at each start offset of a program.
 * Parents are visited before children, so the first writer wins.
 *
 * @param program the program walked
 */
export function declarationStarts(
  program: unknown,
): ReadonlyMap<number, TSESTree.Node> {
  const starts = new Map<number, TSESTree.Node>()

  function visit(node: unknown): void {
    const rec = node as Record<string, unknown> | null
    if (!rec || typeof rec !== 'object' || typeof rec.type !== 'string') return
    const range = rec.range as TSESTree.Range | undefined

    if (range && DECLARATIONS.has(rec.type) && !starts.has(range[0])) {
      starts.set(range[0], node as TSESTree.Node)
    }

    for (const key of Object.keys(rec)) {
      if (NON_CHILD_KEYS.has(key)) continue
      const child = rec[key]
      Array.isArray(child) ? child.forEach(visit) : visit(child)
    }
  }

  visit(program)

  return starts
}
