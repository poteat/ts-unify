import type { ExtractCaptures } from "@/pattern";
import { assertType } from "@/test-utils/assert-type";
import type { TSESTree } from "@typescript-eslint/types";
import { ifToTernarySideEffect } from "./if-to-ternary-side-effect";

describe("ifToTernarySideEffect (type-level)", () => {
  it("captures test, consequent, and alternate", () => {
    type Bag = ExtractCaptures<typeof ifToTernarySideEffect["from"]>;
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
