import type { NodeByKind } from "@/ast/node-by-kind";
import { assertType } from "@/test-utils/assert-type";

// Utility: union of keys across a union type
type KeysOfUnion<T> = T extends any ? keyof T : never;

describe("NodeWithWhen method name collision (when)", () => {
  it("ensures 'when' is not an AST node data field", () => {
    type U = NodeByKind[keyof NodeByKind];
    type AllKeys = KeysOfUnion<U>;
    type HasWhen = "when" extends AllKeys ? true : false;
    assertType<HasWhen, false>(0);
  });
});
