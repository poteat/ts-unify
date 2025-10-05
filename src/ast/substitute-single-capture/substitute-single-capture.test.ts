import type { SubstituteSingleCapture } from "@/ast/substitute-single-capture";
import type { Capture } from "@/capture";
import type { TSESTree } from "@typescript-eslint/types";
import { assertType } from "@/test-utils/assert-type";

describe("SubstituteSingleCapture (type-level)", () => {
  it("substitutes the single capture with normalized expression type", () => {
    type N = {
      type: "ReturnStatement";
      argument: Capture<"arg", string | null>;
    };
    type Out = SubstituteSingleCapture<N, TSESTree.Identifier>;
    type ArgVal = Out["argument"] extends Capture<"arg", infer V> ? V : never;
    assertType<ArgVal, TSESTree.Expression>(0);
  });
});
