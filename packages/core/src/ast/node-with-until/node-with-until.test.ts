import Ast from '@/ast'

describe('NodeWithUntil (type-level)', () => {
  it('preserves chainability after .until()', () => {
    // .until() returns FluentNode<N> — further chaining is valid.
    const p = Ast.U.ThisExpression().until(Ast.U.FunctionDeclaration())
    // Can chain .none() after .until()
    const q = Ast.U.ThisExpression().until(Ast.U.FunctionDeclaration()).none()
    // Suppress unused warnings
    void p
    void q
  })

  it('accepts U.or() as a boundary', () => {
    void Ast.U.ThisExpression().until(
      Ast.U.or(Ast.U.FunctionDeclaration(), Ast.U.FunctionExpression()),
    )
  })
})
