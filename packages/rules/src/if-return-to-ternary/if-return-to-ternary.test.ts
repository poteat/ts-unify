import type { ExtractCaptures } from "@/pattern";
import { assertType } from "@/test-utils/assert-type";
import type { TSESTree } from "@typescript-eslint/types";
import { ifReturnToTernary } from "./if-return-to-ternary";

describe("ifReturnToTernary (type-level)", () => {
  it("captures test, consequent, and alternate", () => {
    type Bag = ExtractCaptures<typeof ifReturnToTernary["from"]>;
    assertType<
      Bag,
      {
        test: TSESTree.Expression;
        consequent: TSESTree.Expression;
        alternate: TSESTree.Expression;
      }
    >(0);
  });
});
