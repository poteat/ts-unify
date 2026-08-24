import { U, $ } from '@'
import type { ExtractCaptures } from '@/pattern'
import AssertType from '@/test-utils/assert-type'

describe('NodeWithWhen bag form on a single-capture node (type-level)', () => {
  it(
    'accepts an annotated bag guard over a U.or and narrows the capture ' +
      'where it is embedded',
    () => {
      const key = U.or(
        U.Identifier({ name: $('key') }),
        U.Literal({ value: $('key') }),
      ).when(
        (bag: { key: unknown }): bag is { key: string } =>
          U.string.identifierName()(bag.key) && !U.string.reserved()(bag.key),
      )
      const p = U.Property({ key, value: U.Identifier({ name: $('name') }) })
      type Bag = ExtractCaptures<typeof p>
      AssertType.assertType<Bag['key'], string>(0)
      AssertType.assertType<Bag['name'], string>(0)
      expect(typeof p).toBe('function')
    },
  )

  it('accepts an annotated bag predicate on a single-capture node', () => {
    const r = U.ReturnStatement({ argument: $('arg') }).when(
      (bag: { arg: unknown }) => bag.arg != null,
    )
    type Bag = ExtractCaptures<typeof r>
    AssertType.assertType<keyof Bag, 'arg'>(0)
    expect(typeof r).toBe('function')
  })
})
