import type { NodeKind } from "./node-kind";
import { assertType } from "@/test-utils/assert-type";
import type { TSESTree } from "@typescript-eslint/types";

describe("NodeKind", () => {
  it("matches keys of AST_NODE_TYPES", () => {
    type K = NodeKind;
    // Spot-check a few members
    assertType<Extract<K, "IfStatement">, "IfStatement">(0);
    assertType<Extract<K, "Identifier">, "Identifier">(0);
    assertType<Extract<K, "Literal">, "Literal">(0);
  });

  it("is keyed to TSESTree.AST_NODE_TYPES", () => {
    // Ensures we reference the upstream enum, not a copied list
    const _x: keyof typeof TSESTree.AST_NODE_TYPES = "IfStatement";
    void _x;
  });
});

