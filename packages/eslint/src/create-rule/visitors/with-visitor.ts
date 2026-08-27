import { commentNodes } from '@ts-unify/engine'
import type { Visitor } from '@ts-unify/eslint/rule-module'
import type { TSESTree } from '@typescript-eslint/types'

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
 * @returns a new table with the visitor added, the `Program` visitor wrapped
 *          when needed
 */
export function withVisitor(
  visitors: ReadonlyMap<string, Visitor>,
  tag: string,
  visit: Visitor,
): ReadonlyMap<string, Visitor> {
  const prev = visitors.get('Program')
  const isComment = tag === 'Comment'
  const isProgramWithPrev = tag === 'Program' && prev
  const entry: readonly [string, Visitor] = isComment
    ? [
        'Program',
        (program: TSESTree.Node) => {
          prev?.(program)

          for (const c of commentNodes(program))
            visit(c as unknown as TSESTree.Node)
        },
      ]
    : isProgramWithPrev
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
