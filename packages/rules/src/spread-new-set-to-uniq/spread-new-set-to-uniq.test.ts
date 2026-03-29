import type { ExtractCaptures } from "@/pattern";
import { assertType } from "@/test-utils/assert-type";
import type { TSESTree } from "@typescript-eslint/types";
import { spreadNewSetToUniq } from "./spread-new-set-to-uniq";

describe("spreadNewSetToUniq (type-level)", () => {
  it("captures the array argument", () => {
    type Bag = ExtractCaptures<typeof spreadNewSetToUniq["from"]>;
    assertType<Bag, { array: TSESTree.Expression | TSESTree.SpreadElement }>(0);
  });
});
