import Ast from '@/ast'

describe('NodeWithExactly (type-level)', () => {
  it('preserves chainability after .exactly()', () => {
    void Ast.U.ThisExpression().exactly(1)
  })

  it('chains after .until()', () => {
    void Ast.U.ThisExpression().until(Ast.U.FunctionDeclaration()).exactly(1)
  })
})
