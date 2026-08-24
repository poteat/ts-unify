import type { NodeByKind } from '@/ast/node-by-kind'
import AssertType from '@/test-utils/assert-type'
import type { KeysOfUnion } from '@/type-utils'

describe('NodeWithSeal name collisions', () => {
  it("ensures 'seal' is not an AST node data field", () => {
    type U = NodeByKind[keyof NodeByKind]
    type AllKeys = KeysOfUnion<U>
    type HasSeal = 'seal' extends AllKeys ? true : false
    AssertType.assertType<HasSeal, false>(0)
  })
})
