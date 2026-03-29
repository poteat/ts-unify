import type { ExtractCaptures } from "@/pattern";
import { assertType } from "@/test-utils/assert-type";
import type { TSESTree } from "@typescript-eslint/types";
import { typeofUndefinedToNullishCheck } from "./typeof-undefined-to-nullish-check";

describe("typeofUndefinedToNullishCheck (type-level)", () => {
  it("captures the expression being checked", () => {
    type Bag = ExtractCaptures<typeof typeofUndefinedToNullishCheck["from"]>;
    assertType<Bag, { expr: TSESTree.Expression }>(0);
  });
});
