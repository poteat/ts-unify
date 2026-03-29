import type { ExtractCaptures } from "@/pattern";
import { assertType } from "@/test-utils/assert-type";
import type { TSESTree } from "@typescript-eslint/types";
import { arrayFromMapToArrayFrom } from "./array-from-map-to-array-from";

describe("arrayFromMapToArrayFrom (type-level)", () => {
  it("captures the iterable and mapFn arguments", () => {
    type Bag = ExtractCaptures<typeof arrayFromMapToArrayFrom["from"]>;
    assertType<
      Bag,
      {
        iterable: TSESTree.Expression | TSESTree.SpreadElement;
        mapFn: TSESTree.Expression | TSESTree.SpreadElement;
      }
    >(0);
  });
});
