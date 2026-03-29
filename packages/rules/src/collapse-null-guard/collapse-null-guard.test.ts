import type { ExtractCaptures } from "@/pattern";
import { assertType } from "@/test-utils/assert-type";
import type { TSESTree } from "@typescript-eslint/types";
import { collapseNullGuard } from "./collapse-null-guard";

describe("collapseNullGuard (type-level)", () => {
  it("captures body, value, fallback, and typeAnnotation", () => {
    type Bag = ExtractCaptures<(typeof collapseNullGuard)["from"]>;
    assertType<
      Bag,
      {
        body: ReadonlyArray<TSESTree.Statement>;
        value: TSESTree.Expression & (TSESTree.Expression | null);
        fallback: TSESTree.Expression;
        typeAnnotation: TSESTree.TypeNode;
      }
    >(0);
  });
});
