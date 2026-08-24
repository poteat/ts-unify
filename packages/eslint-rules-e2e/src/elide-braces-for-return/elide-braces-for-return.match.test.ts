/**
 * The patterns extractPatterns reads off elideBracesForReturn, matched against
 * hand-built nodes.
 *
 * @scenario
 */
import { match, extractPatterns } from '@ts-unify/engine'
import { elideBracesForReturn } from '@ts-unify/rules'

import Nodes from '../nodes'

describe('elide-braces-for-return.match', () => {
  const rule = extractPatterns(elideBracesForReturn)[0]

  it('extracts as a BlockStatement pattern', () => {
    expect(rule.tag).toBe('BlockStatement')
  })

  it('matches (x) => { return x + 1; }', () => {
    const ast = Nodes.blockOf(
      { type: 'ArrowFunctionExpression' },
      {
        type: 'ReturnStatement',
        argument: {
          type: 'BinaryExpression',
          operator: '+',
          left: { type: 'Identifier', name: 'x' },
          right: { type: 'Literal', value: 1 },
        },
      },
    )

    const bag = match(ast, rule.pattern)
    expect(bag).not.toBeNull()
    expect(bag?.argument).toEqual(ast.body[0].argument)
  })

  it('rejects when parent is not ArrowFunctionExpression', () => {
    expect(
      match(
        {
          type: 'BlockStatement',

          parent: {
            type: 'FunctionDeclaration',
          },

          body: [
            {
              type: 'ReturnStatement',

              argument: {
                type: 'Literal',
                value: 1,
              },
            },
          ],
        },
        rule.pattern,
      ),
    ).toBeNull()
  })

  it('rejects a block with two statements', () => {
    expect(
      match(
        {
          type: 'BlockStatement',

          parent: {
            type: 'ArrowFunctionExpression',
          },

          body: [
            {
              type: 'ReturnStatement',

              argument: {
                type: 'Literal',
                value: 1,
              },
            },
            {
              type: 'ReturnStatement',

              argument: {
                type: 'Literal',
                value: 2,
              },
            },
          ],
        },
        rule.pattern,
      ),
    ).toBeNull()
  })

  it('rejects a block whose single statement is not ReturnStatement', () => {
    expect(
      match(
        {
          type: 'BlockStatement',

          parent: {
            type: 'ArrowFunctionExpression',
          },

          body: [
            {
              type: 'ExpressionStatement',

              expression: {
                type: 'Literal',
                value: 1,
              },
            },
          ],
        },
        rule.pattern,
      ),
    ).toBeNull()
  })
})
