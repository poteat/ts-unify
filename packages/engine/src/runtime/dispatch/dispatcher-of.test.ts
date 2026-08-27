import ExtractPatterns from '../extract-patterns'
import Match from '../match'
import Fixtures from '../match/fixtures'
import { dispatcherOf } from './dispatcher-of'
import DispatchFixtures from './fixtures'
import Tree from './tree'

const names = (node: unknown) =>
  dispatcherOf(DispatchFixtures.ENTRIES)(node).map(it => it.name)

describe('dispatcher-of', () => {
  it('names the entries whose literals the node holds, in order', () => {
    expect(names({ operator: '||', left: { type: 'Identifier' } })).toEqual([
      'or',
      'any',
      'or-id',
    ])
    expect(names({ operator: '&&', left: { type: 'Identifier' } })).toEqual([
      'and',
      'any',
    ])
    expect(names({ operator: '===' })).toEqual(['any', 'eq'])
  })

  it('keeps only the entries without a literal there otherwise', () => {
    expect(names({ operator: '??' })).toEqual(['any'])
    expect(names(null)).toEqual(['any'])
  })

  it('reads each path once, down a tree as deep as the literals', () => {
    const tree = Tree.buildTree(
      DispatchFixtures.ENTRIES.map(entry => ({
        entry,
        literals: Match.rootLiteralsOf(entry.pattern),
      })),
    )
    expect(tree.isLeaf).toBe(false)
    if (tree.isLeaf) return
    expect(tree.path).toEqual(['operator'])
    expect([...tree.branches.keys()]).toEqual(['&&', '||', '==', '==='])
    const under = tree.branches.get('||')
    expect(under?.isLeaf).toBe(false)
    if (!under || under.isLeaf) return
    expect(under.path).toEqual(['left', 'type'])
    expect(tree.rest).toEqual({
      isLeaf: true,
      entries: [DispatchFixtures.ENTRIES[2]],
    })
  })

  it('admits every entry that matches, over a program', () => {
    const admitted = dispatcherOf(
      ExtractPatterns.extractPatterns(DispatchFixtures.THREE_EXPRESSIONS),
    )
    const expressions = (
      Fixtures.program('a && b.c; x || y; typeof z === "undefined"; p ?? q')
        .body as { expression: unknown }[]
    ).map(it => it.expression)
    expect(
      expressions.map(
        node =>
          admitted(node).filter(it =>
            Match.matchAdmitted(node, it.pattern, it.chain),
          ).length,
      ),
    ).toEqual([1, 1, 1, 0])
    expect(admitted(expressions[3])).toEqual([])
  })
})
