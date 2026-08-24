import { commentNodes } from '@ts-unify/engine'
import type { TSESTree } from '@typescript-eslint/types'

import type { Visitor } from '../../rule-module'

/**
 * A visitor table with one more visitor.
 *
 * ESLint does not visit comments: a `Comment` visitor runs over the
 * Program's comments after whatever visits the Program, and a `Program`
 * visitor keeps its place before that.
 *
 * @param visitors the visitors so far
 * @param tag the node type the visitor is for
 * @param visit the visitor
 */
export function withVisitor(
  visitors: ReadonlyMap<string, Visitor>,
  tag: string,
  visit: Visitor,
): ReadonlyMap<string, Visitor> {
  const prev = visitors.get('Program')
  const entry: readonly [string, Visitor] =
    tag === 'Comment'
      ? [
          'Program',
          (program: TSESTree.Node) => {
            prev?.(program)

            for (const c of commentNodes(program))
              visit(c as unknown as TSESTree.Node)
          },
        ]
      : tag === 'Program' && prev
        ? [
            'Program',
            (program: TSESTree.Node) => {
              visit(program)
              prev(program)
            },
          ]
        : [tag, visit]

  return new Map([...visitors, entry])
}
