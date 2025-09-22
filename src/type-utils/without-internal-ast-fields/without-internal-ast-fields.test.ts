import type { WithoutInternalAstFields } from "@/type-utils";
import type { TSESTree } from "@typescript-eslint/types";
import { assertType } from "@/test-utils/assert-type/assert-type";

describe("WithoutInternalAstFields", () => {
  it("removes bookkeeping fields from a single node shape", () => {
    type Input = TSESTree.ReturnStatement;
    type Result = WithoutInternalAstFields<Input>;
    type Expected = Omit<Input, "parent" | "loc" | "range">;
    assertType<Result, Expected>(0);
  });

  it("distributes over a union of node shapes", () => {
    type Union = TSESTree.ReturnStatement | TSESTree.ConditionalExpression;
    type Result = WithoutInternalAstFields<Union>;
    type Expected =
      | WithoutInternalAstFields<TSESTree.ReturnStatement>
      | WithoutInternalAstFields<TSESTree.ConditionalExpression>;
    assertType<Result, Expected>(0);
  });
});
