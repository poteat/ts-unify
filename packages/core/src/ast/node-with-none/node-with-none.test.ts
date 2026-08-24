import Ast from '@/ast'

describe('node-with-none', () => {
  it('preserves chainability after .none()', () => {
    void Ast.U.ThisExpression().none()
  })

  it('chains after .until()', () => {
    void Ast.U.ThisExpression().until(Ast.U.FunctionDeclaration()).none()
  })
})
