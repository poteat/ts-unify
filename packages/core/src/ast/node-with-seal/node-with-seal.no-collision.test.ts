import type { NodeByKind } from "@/ast/node-by-kind";
import type { KeysOfUnion } from "@/type-utils";
import { assertType } from "@/test-utils/assert-type/assert-type";

describe("NodeWithSeal name collisions", () => {
  it("ensures 'seal' is not an AST node data field", () => {
    type U = NodeByKind[keyof NodeByKind];
    type AllKeys = KeysOfUnion<U>;
    type HasSeal = "seal" extends AllKeys ? true : false;
    assertType<HasSeal, false>(0);
  });
});
