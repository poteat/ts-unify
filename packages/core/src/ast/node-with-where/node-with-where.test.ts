import Ast from '@/ast'
import Capture from '@/capture'
import type { ExtractCaptures } from '@/pattern'
import AssertType from '@/test-utils/assert-type'

describe('node-with-where', () => {
  it('preserves the capture bag through .where()', () => {
    const pattern = Ast.U.FunctionDeclaration({
      id: Capture.$('id'),
      body: Capture.$('body'),
    }).where(Ast.U.ThisExpression().none())
    type Bag = ExtractCaptures<typeof pattern>
    AssertType.assertType<keyof Bag, 'id' | 'body'>(0)
  })

  it('chains with .to() after .where()', () => {
    void Ast.U.ReturnStatement({
      argument: Capture.$('expr'),
    })
      .where(Ast.U.ThisExpression().none())
      .to(it =>
        Ast.U.ReturnStatement({
          argument: it.expr,
        }),
      )
  })

  it('accepts multiple constraints', () => {
    const fnBoundary = Ast.U.or(
      Ast.U.FunctionDeclaration(),
      Ast.U.FunctionExpression(),
    )

    void Ast.U.FunctionDeclaration({
      ...Capture.$,
    }).where(
      Ast.U.ThisExpression().until(fnBoundary).none(),
      Ast.U.Identifier({
        name: 'arguments',
      })
        .until(fnBoundary)
        .none(),
    )
  })
})
