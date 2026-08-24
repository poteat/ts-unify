import type { IsAstNode } from "@/ast/is-ast-node";
import type { TSESTree } from "@typescript-eslint/types";
import { assertType } from "@/test-utils/assert-type";

describe("IsAstNode", () => {
  it("is true for a concrete node and false otherwise", () => {
    assertType<IsAstNode<TSESTree.Identifier>, true>(0);
    assertType<IsAstNode<{ parent?: unknown }>, false>(0);
    assertType<IsAstNode<string>, false>(0);
  });
});
