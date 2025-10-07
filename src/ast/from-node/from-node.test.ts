import type { BuilderMap, NodeByKind } from "@/ast";
import type { UnwrapFluent } from "@/ast/unwrap-fluent";
import { AST_NODE_TYPES } from "@typescript-eslint/types";
import { assertType } from "@/test-utils/assert-type";

describe("U.fromNode typing (type-level)", () => {
  it("type-only input returns discriminant only", () => {
    function check(U: BuilderMap) {
      const n = U.fromNode({ type: AST_NODE_TYPES.ReturnStatement });
      type Inner = UnwrapFluent<typeof n>;
      // Expect `{ type: 'ReturnStatement' }`
      assertType<Inner, { type: NodeByKind["ReturnStatement"]["type"] }>(0);
    }
    void check;
  });

  it("shape input returns concrete node type", () => {
    function check(U: BuilderMap) {
      const n = U.fromNode({
        type: AST_NODE_TYPES.ReturnStatement,
        argument: null,
      });
      type Inner = UnwrapFluent<typeof n>;
      assertType<Inner, NodeByKind["ReturnStatement"]>(0);
    }
    void check;
  });
});
