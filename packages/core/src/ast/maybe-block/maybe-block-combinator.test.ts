import type { BuilderMap } from '@/ast'
import type { OR_BRAND } from '@/ast/or'
import Capture from '@/capture'
import AssertType from '@/test-utils/assert-type'

describe('maybe-block-combinator', () => {
  it('matches both block and non-block forms and preserves captures', () => {
    function check(u: BuilderMap) {
      const mb = u.maybeBlock(
        u.ReturnStatement({
          argument: Capture.$('value'),
        }),
      )

      type Brand = (typeof mb)[typeof OR_BRAND]
      AssertType.assertType<Brand, true>(0)
    }

    void check
  })
})
