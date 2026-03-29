import type { ExtractCaptures } from "@/pattern";
import { assertType } from "@/test-utils/assert-type";
import type { TSESTree } from "@typescript-eslint/types";
import { elideBracesForReturn } from "./elide-braces-for-return";

describe("elideBracesForReturn (type-level)", () => {
  it("captures the return argument with Expression type (after defaultUndefined)", () => {
    type Bag = ExtractCaptures<typeof elideBracesForReturn["from"]>;
    assertType<Bag, { argument: TSESTree.Expression }>(0);
  });
});
