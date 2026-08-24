import Ast from '@/ast'

describe('NodeWithSome (type-level)', () => {
  it('preserves chainability after .some()', () => {
    void Ast.U.ThisExpression().some()
  })

  it('chains after .until()', () => {
    void Ast.U.ThisExpression().until(Ast.U.FunctionDeclaration()).some()
  })
})
