import { match, extractPatterns } from '@ts-unify/engine'
import { addReturnToBlock } from '@ts-unify/rules'

describe('addReturnToBlock matching', () => {
  const rule = extractPatterns(addReturnToBlock)[0]!

  it('extracts as a BlockStatement pattern', () => {
    expect(rule.tag).toBe('BlockStatement')
  })

  it('matches function() { expr(); }', () => {
    const ast = {
      type: 'BlockStatement',
      parent: { type: 'FunctionDeclaration' },
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'CallExpression',
            callee: { type: 'Identifier', name: 'fn' },
            arguments: [],
          },
        },
      ],
    }

    const bag = match(ast, rule.pattern)
    expect(bag).not.toBeNull()
    expect(bag!.expression).toEqual(ast.body[0].expression)
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

  it('rejects a node whose single body element is not ExpressionStatement', () => {
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
