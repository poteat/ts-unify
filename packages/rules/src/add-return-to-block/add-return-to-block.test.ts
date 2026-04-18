import type { ExtractCaptures } from "@/pattern";
import { assertType } from "@/test-utils/assert-type";
import type { TSESTree } from "@typescript-eslint/types";
import { addReturnToBlock } from "./add-return-to-block";

describe("addReturnToBlock (type-level)", () => {
  it("captures the expression from the single expression statement", () => {
    type Bag = ExtractCaptures<typeof addReturnToBlock>;
    assertType<Bag, { expression: TSESTree.Expression }>(0);
  });
});
