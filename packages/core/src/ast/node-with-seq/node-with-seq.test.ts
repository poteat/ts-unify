import Ast from '@/ast'
import type { SEQ_BRAND } from '@/ast/seq-brand'
import SrcCapture from '@/capture'
import type { Capture } from '@/capture'
import type { ExtractCaptures } from '@/pattern'
import AssertType from '@/test-utils/assert-type'

describe('NodeWithSeq (type-level)', () => {
  it('extracts from raw captures in seq', () => {
    type RawSeq = {
      readonly [SEQ_BRAND]: [Capture<'a', number>, Capture<'b', string>]
    }
    type Bag = ExtractCaptures<RawSeq>
    AssertType.assertType<keyof Bag, 'a' | 'b'>(0)
  })

  it('U.seq() carries SEQ_BRAND', () => {
    const s = Ast.U.seq(SrcCapture.$('x'), SrcCapture.$('y'))
    type HasBrand = typeof s extends { readonly [SEQ_BRAND]: unknown }
      ? true
      : false
    const _: HasBrand = true
    void _
  })

  it('extracts typed captures from U.seq with FluentNode elements', () => {
    const s = Ast.U.seq(
      Ast.U.ReturnStatement({ argument: SrcCapture.$('arg') }),
      SrcCapture.$('next'),
    )
    type Bag = ExtractCaptures<typeof s>
    AssertType.assertType<keyof Bag, 'arg' | 'next'>(0)
  })

  it('seq inside BlockStatement propagates captures to parent', () => {
    const pattern = Ast.U.BlockStatement({
      body: [
        ...SrcCapture.$('before'),
        Ast.U.seq(
          Ast.U.ReturnStatement({ argument: SrcCapture.$('x') }),
          SrcCapture.$('y'),
        ),
        ...SrcCapture.$('after'),
      ],
    })
    type Bag = ExtractCaptures<typeof pattern>
    AssertType.assertType<keyof Bag, 'before' | 'after' | 'x' | 'y'>(0)
  })

  it('.to() callback receives the typed bag — compiles without annotations', () => {
    Ast.U.seq(
      Ast.U.VariableDeclaration({
        kind: 'const',
        declarations: [
          Ast.U.VariableDeclarator({
            id: SrcCapture.$('id'),
            init: SrcCapture.$('init'),
          }),
        ],
      }),
      SrcCapture.$('stmt'),
    ).to(bag => {
      // If the bag were Record<string, unknown>, this destructure would fail.
      const { id, init, stmt } = bag
      void id
      void init
      void stmt

      return null
    })
  })

  it(
    'seq with .to() inside BlockStatement still propagates captures to ' +
      '.when()',
    () => {
      const seqRewrite = Ast.U.seq(
        Ast.U.VariableDeclaration({
          kind: 'const',
          declarations: [
            Ast.U.VariableDeclarator({
              id: SrcCapture.$('id'),
              init: SrcCapture.$('init'),
            }),
          ],
        }),
        SrcCapture.$('stmt'),
      ).to(bag => {
        void bag

        return null
      })

      const pattern = Ast.U.BlockStatement({
        body: [...SrcCapture.$('before'), seqRewrite, ...SrcCapture.$('after')],
      })

      type Bag = ExtractCaptures<typeof pattern>
      AssertType.assertType<
        keyof Bag,
        'before' | 'after' | 'id' | 'init' | 'stmt'
      >(0)
    },
  )
})
