import Ast from '@/ast'

describe('NodeWithAtLeast (type-level)', () => {
  it('preserves chainability after .atLeast()', () => {
    void Ast.U.ThisExpression().atLeast(3)
  })

  it('chains after .until()', () => {
    void Ast.U.ThisExpression().until(Ast.U.FunctionDeclaration()).atLeast(3)
  })
})
