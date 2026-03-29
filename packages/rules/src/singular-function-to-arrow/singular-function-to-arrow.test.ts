import type { ExtractCaptures } from "@/pattern";
import { assertType } from "@/test-utils/assert-type";
import type { TSESTree } from "@typescript-eslint/types";
import { functionDeclReturnToArrow } from "./singular-function-to-arrow";

describe("functionDeclReturnToArrow (type-level)", () => {
  it("captures function components and derived init", () => {
    type Bag = ExtractCaptures<(typeof functionDeclReturnToArrow)["from"]>;
    assertType<Bag["async"], boolean>(0);
    assertType<Bag["declare"], boolean>(0);
    assertType<Bag["expression"], false>(0);
    assertType<Bag["id"], TSESTree.Identifier | null>(0);
    assertType<Bag["params"], TSESTree.Parameter[]>(0);
    assertType<Bag["returnType"], TSESTree.TSTypeAnnotation | undefined>(0);
    assertType<Bag["typeParameters"], TSESTree.TSTypeParameterDeclaration | undefined>(0);
    assertType<Bag["body"], TSESTree.Expression | TSESTree.Statement>(0);
    assertType<Bag["init"], TSESTree.Expression>(0);
    assertType<
      keyof Bag,
      | "async"
      | "declare"
      | "expression"
      | "id"
      | "params"
      | "returnType"
      | "typeParameters"
      | "body"
      | "init"
    >(0);
  });
});
