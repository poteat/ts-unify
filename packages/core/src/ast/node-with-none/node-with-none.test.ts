import Ast from '@/ast'

describe('NodeWithNone (type-level)', () => {
  it('preserves chainability after .none()', () => {
    void Ast.U.ThisExpression().none()
  })

  it('chains after .until()', () => {
    void Ast.U.ThisExpression().until(Ast.U.FunctionDeclaration()).none()
  })
})
