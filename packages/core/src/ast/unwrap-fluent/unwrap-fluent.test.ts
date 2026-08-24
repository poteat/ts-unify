import type { FluentNode } from '@/ast/fluent-node'
import type { UnwrapFluent } from '@/ast/unwrap-fluent'
import AssertType from '@/test-utils/assert-type'

describe('unwrap-fluent', () => {
  it('unwraps FluentNode<N> to N', () => {
    type N = { type: 'X' }
    type F = FluentNode<N>
    type U = UnwrapFluent<F>
    AssertType.assertType<U, N>(0)
  })

  it('passes through non-fluent types unchanged', () => {
    type T = string | number
    type U = UnwrapFluent<T>
    AssertType.assertType<U, T>(0)
  })
})
