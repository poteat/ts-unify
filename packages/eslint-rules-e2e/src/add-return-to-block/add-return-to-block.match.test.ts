/**
 * The patterns extractPatterns reads off addReturnToBlock, matched against
 * hand-built nodes.
 *
 * @scenario
 */
import { match, extractPatterns } from '@ts-unify/engine'
import { addReturnToBlock } from '@ts-unify/rules'

import Nodes from '../nodes'

describe('add-return-to-block.match', () => {
  const rule = extractPatterns(addReturnToBlock)[0]

  it('extracts as a BlockStatement pattern', () => {
    expect(rule.tag).toBe('BlockStatement')
  })

  it('matches function() { expr(); }', () => {
    const ast = Nodes.blockOf(
      { type: 'FunctionDeclaration' },
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'CallExpression',
          callee: { type: 'Identifier', name: 'fn' },
          arguments: [],
        },
      },
    )

    const bag = match(ast, rule.pattern)
    expect(bag).not.toBeNull()
    expect(bag?.expression).toEqual(ast.body[0].expression)
  })

  it('matches arrow function body', () => {
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
                type: 'Identifier',
                name: 'x',
              },
            },
          ],
        },
        rule.pattern,
      ),
    ).not.toBeNull()
  })

  it('rejects when parent is not a function', () => {
    expect(
      match(
        {
          type: 'BlockStatement',

          parent: {
            type: 'IfStatement',
          },

          body: [
            {
              type: 'ExpressionStatement',

              expression: {
                type: 'Identifier',
                name: 'x',
              },
            },
          ],
        },
        rule.pattern,
      ),
    ).toBeNull()
  })

  it('rejects a node whose body has wrong length', () => {
    expect(
      match(
        {
          type: 'BlockStatement',

          parent: {
            type: 'FunctionDeclaration',
          },

          body: [
            {
              type: 'ExpressionStatement',

              expression: {
                type: 'Identifier',
                name: 'a',
              },
            },
            {
              type: 'ExpressionStatement',

              expression: {
                type: 'Identifier',
                name: 'b',
              },
            },
          ],
        },
        rule.pattern,
      ),
    ).toBeNull()
  })

  it('rejects a body whose one statement is not an ExpressionStatement', () => {
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
                type: 'Identifier',
                name: 'x',
              },
            },
          ],
        },
        rule.pattern,
      ),
    ).toBeNull()
  })
})
