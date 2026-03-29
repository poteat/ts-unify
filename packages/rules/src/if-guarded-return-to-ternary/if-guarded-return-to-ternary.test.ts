import type { ExtractCaptures } from "@/pattern";
import { assertType } from "@/test-utils/assert-type";
import type { TSESTree } from "@typescript-eslint/types";
import { ifGuardedReturnToTernary } from "./if-guarded-return-to-ternary";

describe("ifGuardedReturnToTernary (type-level)", () => {
  it("captures body spread, test, sealed consequent, and alternate", () => {
    type Bag = ExtractCaptures<typeof ifGuardedReturnToTernary["from"]>;
    assertType<
      Bag,
      {
        body: ReadonlyArray<TSESTree.Statement>;
        test: TSESTree.Expression;
        consequent: TSESTree.Expression;
        alternate: TSESTree.Expression;
      }
    >(0);
  });
});
