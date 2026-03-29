import type { ExtractCaptures } from "@/pattern";
import { assertType } from "@/test-utils/assert-type";
import type { TSESTree } from "@typescript-eslint/types";
import { guardedForPushToFilterMap } from "./guarded-for-push-to-filter-map";

describe("guardedForPushToFilterMap (type-level)", () => {
  it("captures all loop and array components", () => {
    type Bag = ExtractCaptures<typeof guardedForPushToFilterMap["from"]>;
    assertType<
      Bag,
      {
        before: ReadonlyArray<TSESTree.Statement>;
        after: ReadonlyArray<TSESTree.Statement>;
        arrayId: TSESTree.BindingName;
        loopVar: TSESTree.BindingName;
        source: TSESTree.Expression;
        condition: TSESTree.Expression;
        pushValue: TSESTree.Expression | TSESTree.SpreadElement;
      }
    >(0);
  });
});
