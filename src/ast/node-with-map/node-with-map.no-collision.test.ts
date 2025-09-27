import type { NodeByKind } from "@/ast/node-by-kind";
import type { KeysOfUnion } from "@/type-utils";
import { assertType } from "@/test-utils/assert-type";

describe("NodeWithMap method name collision (map)", () => {
  it("ensures 'map' is not an AST node data field", () => {
    type U = NodeByKind[keyof NodeByKind];
    type AllKeys = KeysOfUnion<U>;
    type HasMap = "map" extends AllKeys ? true : false;
    assertType<HasMap, false>(0);
  });
});
