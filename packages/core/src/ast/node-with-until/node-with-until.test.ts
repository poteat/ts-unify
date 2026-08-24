import Ast from '@/ast'

describe('node-with-until', () => {
  it('returns a FluentNode that chains .none() after .until()', () => {
    const p = Ast.U.ThisExpression().until(Ast.U.FunctionDeclaration())
    const q = Ast.U.ThisExpression().until(Ast.U.FunctionDeclaration()).none()
    void p
    void q
  })

  it('accepts U.or() as a boundary', () => {
    void Ast.U.ThisExpression().until(
      Ast.U.or(Ast.U.FunctionDeclaration(), Ast.U.FunctionExpression()),
    )
  })
})
