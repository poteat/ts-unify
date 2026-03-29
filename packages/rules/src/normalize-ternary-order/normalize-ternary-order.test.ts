import type { ExtractCaptures } from "@/pattern";
import { assertType } from "@/test-utils/assert-type";
import type { TSESTree } from "@typescript-eslint/types";
import { AST_NODE_TYPES } from "@typescript-eslint/types";
import { normalizeTernaryOrder } from "./normalize-ternary-order";

describe("normalizeTernaryOrder (type-level)", () => {
  it("captures ternary components and binary operator parts", () => {
    type Bag = ExtractCaptures<(typeof normalizeTernaryOrder)["from"]>;
    assertType<Bag["condition"], TSESTree.Expression>(0);
    assertType<Bag["consequent"], TSESTree.Expression>(0);
    assertType<Bag["alternate"], TSESTree.Expression>(0);
    assertType<Bag["operator"], TSESTree.BinaryExpression["operator"]>(0);
    assertType<Bag["left"], TSESTree.BinaryExpression["left"]>(0);
    assertType<Bag["right"], TSESTree.Expression>(0);
    assertType<Bag["test"], TSESTree.Expression>(0);
    assertType<Bag["type"], AST_NODE_TYPES.BinaryExpression>(0);
    assertType<
      keyof Bag,
      | "condition"
      | "consequent"
      | "alternate"
      | "operator"
      | "left"
      | "right"
      | "test"
      | "type"
    >(0);
  });
});
