import type { NodeByKind } from "@/ast/node-by-kind";
import type { KeysOfUnion } from "@/type-utils";
import { assertType } from "@/test-utils/assert-type";

describe("NodeWithTruthy method name collision (truthy)", () => {
  it("ensures 'truthy' is not an AST node data field", () => {
    type U = NodeByKind[keyof NodeByKind];
    type AllKeys = KeysOfUnion<U>;
    type HasTruthy = "truthy" extends AllKeys ? true : false;
    assertType<HasTruthy, false>(0);
  });
});

