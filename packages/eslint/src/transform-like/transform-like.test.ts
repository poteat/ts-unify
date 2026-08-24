import { U, $ } from '@ts-unify/core'

import type { MatchLike } from './match-like'
import type { TransformLike } from './transform-like'

describe('transform-like', () => {
  const id = U.Identifier({ name: $('n') })
  const rewrite = U.Identifier({ name: $('n') }).to(it =>
    U.Identifier({ name: it.n }),
  )
  const either = U.or(U.ExportAllDeclaration({}), U.Identifier({}))
  const bare: MatchLike = id
  const asTransform: TransformLike = bare
  const withTo: TransformLike = rewrite
  const union: TransformLike = either

  it('accepts a bare pattern and a pattern with .to()', () => {
    expect([asTransform, withTo, union]).not.toContain(undefined)
  })
})
