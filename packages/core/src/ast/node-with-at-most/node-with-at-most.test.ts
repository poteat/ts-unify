import Ast from '@/ast'

describe('node-with-at-most', () => {
  it('preserves chainability after .atMost()', () => {
    void Ast.U.ThisExpression().atMost(2)
  })

  it('chains after .until()', () => {
    void Ast.U.ThisExpression().until(Ast.U.FunctionDeclaration()).atMost(2)
  })
})
