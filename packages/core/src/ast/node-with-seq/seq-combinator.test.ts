import Ast from '@/ast'
import type { SEQ_BRAND } from '@/ast/seq-brand'
import Capture from '@/capture'
import type { ExtractCaptures } from '@/pattern'
import AssertType from '@/test-utils/assert-type'

describe('seq-combinator', () => {
  it('extracts from raw captures in seq', () => {
    type RawSeq = {
      readonly [SEQ_BRAND]: [
        Capture.Capture<'a', number>,
        Capture.Capture<'b', string>,
      ]
    }
    type Bag = ExtractCaptures<RawSeq>
    AssertType.assertType<keyof Bag, 'a' | 'b'>(0)
  })

  it('U.seq() carries SEQ_BRAND', () => {
    const s = Ast.U.seq(Capture.$('x'), Capture.$('y'))
    type HasBrand = typeof s extends { readonly [SEQ_BRAND]: unknown }
      ? true
      : false
    AssertType.assertType<HasBrand, true>(0)
  })

  it('extracts typed captures from U.seq with FluentNode elements', () => {
    const s = Ast.U.seq(
      Ast.U.ReturnStatement({ argument: Capture.$('arg') }),
      Capture.$('next'),
    )
    type Bag = ExtractCaptures<typeof s>
    AssertType.assertType<keyof Bag, 'arg' | 'next'>(0)
  })

  it('seq inside BlockStatement propagates captures to parent', () => {
    const pattern = Ast.U.BlockStatement({
      body: [
        ...Capture.$('before'),
        Ast.U.seq(
          Ast.U.ReturnStatement({ argument: Capture.$('x') }),
          Capture.$('y'),
        ),
        ...Capture.$('after'),
      ],
    })
    type Bag = ExtractCaptures<typeof pattern>
    AssertType.assertType<keyof Bag, 'before' | 'after' | 'x' | 'y'>(0)
  })

  it('.to() receives the typed bag, destructured without annotations', () => {
    Ast.U.seq(
      Ast.U.VariableDeclaration({
        kind: 'const',
        declarations: [
          Ast.U.VariableDeclarator({
            id: Capture.$('id'),
            init: Capture.$('init'),
          }),
        ],
      }),
      Capture.$('stmt'),
    ).to(bag => {
      const { id, init, stmt } = bag
      void id
      void init
      void stmt

      return null
    })
  })

  it('seq with .to() in a BlockStatement still propagates captures', () => {
    const seqRewrite = Ast.U.seq(
      Ast.U.VariableDeclaration({
        kind: 'const',
        declarations: [
          Ast.U.VariableDeclarator({
            id: Capture.$('id'),
            init: Capture.$('init'),
          }),
        ],
      }),
      Capture.$('stmt'),
    ).to(bag => {
      void bag

      return null
    })

    const pattern = Ast.U.BlockStatement({
      body: [...Capture.$('before'), seqRewrite, ...Capture.$('after')],
    })

    type Bag = ExtractCaptures<typeof pattern>
    AssertType.assertType<
      keyof Bag,
      'before' | 'after' | 'id' | 'init' | 'stmt'
    >(0)
  })
})
