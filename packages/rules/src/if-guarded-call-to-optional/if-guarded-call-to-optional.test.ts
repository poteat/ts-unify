import type { ExtractCaptures } from "@/pattern";
import { assertType } from "@/test-utils/assert-type";
import type { TSESTree } from "@typescript-eslint/types";
import { ifGuardedCallToOptional } from "./if-guarded-call-to-optional";

describe("ifGuardedCallToOptional (type-level)", () => {
  it("captures callee and args", () => {
    type Bag = ExtractCaptures<typeof ifGuardedCallToOptional["from"]>;
    assertType<
      Bag,
      {
        callee: TSESTree.Expression;
        args: TSESTree.CallExpressionArgument[];
      }
    >(0);
  });
});
