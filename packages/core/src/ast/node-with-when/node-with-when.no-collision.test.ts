import type { NodeByKind } from '@/ast/node-by-kind'
import AssertType from '@/test-utils/assert-type'
import type { KeysOfUnion } from '@/type-utils'

describe('NodeWithWhen method name collision (when)', () => {
  it("ensures 'when' is not an AST node data field", () => {
    type U = NodeByKind[keyof NodeByKind]
    type AllKeys = KeysOfUnion<U>
    type HasWhen = 'when' extends AllKeys ? true : false
    AssertType.assertType<HasWhen, false>(0)
  })
})
