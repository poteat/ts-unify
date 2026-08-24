import type { NodeByKind } from "./node-by-kind";
import type { NodeKind } from "@/ast/node-kind";
import { assertType } from "@/test-utils/assert-type";
import type { TSESTree } from "@typescript-eslint/types";
import type { CommentNode } from "@/ast/comment-node";

describe("NodeByKind", () => {
  it("indexes concrete node interfaces by kind", () => {
    type IfNode = NodeByKind["IfStatement"];
    type IdNode = NodeByKind["Identifier"];
    type LitNode = NodeByKind["Literal"];

    assertType<IfNode, TSESTree.IfStatement>(0);
    assertType<IdNode, TSESTree.Identifier>(0);
    assertType<LitNode, TSESTree.Literal>(0);
    assertType<NodeByKind["Comment"], CommentNode>(0);
    assertType<NonNullable<NodeByKind["Program"]["comments"]>, CommentNode[]>(0);
  });

  it("is keyed by NodeKind", () => {
    type Keys = keyof NodeByKind;
    assertType<Keys, NodeKind>(0);
  });
});

