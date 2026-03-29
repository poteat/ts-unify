import type { ExtractCaptures } from "@/pattern";
import { assertType } from "@/test-utils/assert-type";
import type { TSESTree } from "@typescript-eslint/types";
import { objectAssignToSpread } from "./object-assign-to-spread";

describe("objectAssignToSpread (type-level)", () => {
  it("captures the spread sources", () => {
    type Bag = ExtractCaptures<typeof objectAssignToSpread["from"]>;
    assertType<
      Bag,
      { sources: ReadonlyArray<TSESTree.Expression | TSESTree.SpreadElement> }
    >(0);
  });
});
