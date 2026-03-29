import type { ExtractCaptures } from "@/pattern";
import { assertType } from "@/test-utils/assert-type";
import type { TSESTree } from "@typescript-eslint/types";
import { guardAndAccessToOptionalChain } from "./guard-and-access-to-optional-chain";

describe("guardAndAccessToOptionalChain (type-level)", () => {
  it("captures obj and prop", () => {
    type Bag = ExtractCaptures<typeof guardAndAccessToOptionalChain["from"]>;
    assertType<
      Bag,
      {
        obj: TSESTree.Expression;
        prop: TSESTree.Expression | TSESTree.PrivateIdentifier;
      }
    >(0);
  });
});
