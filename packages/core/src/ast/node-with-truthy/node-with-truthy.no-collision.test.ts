import type { NodeByKind } from '@/ast/node-by-kind'
import AssertType from '@/test-utils/assert-type'
import type { KeysOfUnion } from '@/type-utils'

describe('NodeWithTruthy method name collision (truthy)', () => {
  it("ensures 'truthy' is not an AST node data field", () => {
    type U = NodeByKind[keyof NodeByKind]
    type AllKeys = KeysOfUnion<U>
    type HasTruthy = 'truthy' extends AllKeys ? true : false
    AssertType.assertType<HasTruthy, false>(0)
  })
})
