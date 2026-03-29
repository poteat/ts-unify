import type { NormalizeBag } from "@/ast/normalize-bag";
import type { TSESTree } from "@typescript-eslint/types";
import { assertType } from "@/test-utils/assert-type";

describe("NormalizeBag (type-level)", () => {
  it("normalizes each entry using NormalizeCaptured", () => {
    type Bag = {
      a: { type: "Literal" };
      b: { type: "ReturnStatement" };
    };
    type NB = NormalizeBag<Bag>;
    type A = NB["a"];
    type B = NB["b"];
    assertType<A, TSESTree.Expression>(0);
    assertType<B, TSESTree.Statement>(0);
  });
});
