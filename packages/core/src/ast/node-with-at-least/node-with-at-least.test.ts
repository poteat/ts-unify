import Ast from '@/ast'

/**
 * How many matches the quantifier asks for.
 */
const COUNT = 3

describe('node-with-at-least', () => {
  it('preserves chainability after .atLeast()', () => {
    void Ast.U.ThisExpression().atLeast(COUNT)
  })

  it('chains after .until()', () => {
    void Ast.U.ThisExpression()
      .until(Ast.U.FunctionDeclaration())
      .atLeast(COUNT)
  })
})
