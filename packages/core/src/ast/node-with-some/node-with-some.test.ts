import Ast from '@/ast'

describe('node-with-some', () => {
  it('preserves chainability after .some()', () => {
    void Ast.U.ThisExpression().some()
  })

  it('chains after .until()', () => {
    void Ast.U.ThisExpression().until(Ast.U.FunctionDeclaration()).some()
  })
})
