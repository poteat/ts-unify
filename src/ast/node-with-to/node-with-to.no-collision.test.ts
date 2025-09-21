import type { NodeByKind } from "@/ast/node-by-kind";
import type { KeysOfUnion } from "@/test-utils/keys-of-union";
import { assertType } from "@/test-utils/assert-type";

describe("NodeWithTo method name collision (to)", () => {
  it("ensures 'to' is not an AST node data field", () => {
    type U = NodeByKind[keyof NodeByKind];
    type AllKeys = KeysOfUnion<U>;
    type HasTo = "to" extends AllKeys ? true : false;
    assertType<HasTo, false>(0);
  });
});
