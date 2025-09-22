import type { WithoutInternalAstFields } from "@/type-utils";
import type {
  ConditionalExpression,
  ReturnStatement,
} from "@typescript-eslint/types/dist/generated/ast-spec";
import { assertType } from "@/test-utils/assert-type/assert-type";

describe("WithoutInternalAstFields", () => {
  it("removes bookkeeping fields from a single node shape", () => {
    type Input = ReturnStatement;
    type Result = WithoutInternalAstFields<Input>;
    type Expected = Omit<Input, "parent" | "loc" | "range">;
    assertType<Result, Expected>(0);
  });

  it("distributes over a union of node shapes", () => {
    type Union = ReturnStatement | ConditionalExpression;
    type Result = WithoutInternalAstFields<Union>;
    type Expected =
      | WithoutInternalAstFields<ReturnStatement>
      | WithoutInternalAstFields<ConditionalExpression>;
    assertType<Result, Expected>(0);
  });
});
