import type { NodeByKind } from '@/ast/node-by-kind'
import AssertType from '@/test-utils/assert-type'
import type { KeysOfUnion } from '@/type-utils'

describe('NodeWithTo method name collision (to)', () => {
  it("ensures 'to' is not an AST node data field", () => {
    type U = NodeByKind[keyof NodeByKind]
    type AllKeys = KeysOfUnion<U>
    type HasTo = 'to' extends AllKeys ? true : false
    AssertType.assertType<HasTo, false>(0)
  })
})
