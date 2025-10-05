import type { NodeWithSeal } from "@/ast/node-with-seal";
import type { Capture } from "@/capture";
import { assertType } from "@/test-utils/assert-type";

describe("NodeWithSeal gating (type-level)", () => {
  it("allows zero/single-capture seal() without parameter", () => {
    type Zero = { type: "X" };
    type One = { type: "Y"; arg: Capture<"a", number> };
    type ZS = NodeWithSeal<Zero>;
    type OS = NodeWithSeal<One>;
    // Both overloads resolve to a callable zero-arg form
    type ZeroSeal = ZS["seal"] extends () => any ? true : false;
    type OneSeal = OS["seal"] extends () => any ? true : false;
    assertType<ZeroSeal, true>(0);
    assertType<OneSeal, true>(0);
  });

  it("returns never in multi-capture contexts (causing type error)", () => {
    type Many = { type: "Z"; a: Capture<"a">; b: Capture<"b"> };
    type MS = NodeWithSeal<Many>;
    type Ret = MS["seal"] extends () => infer R ? R : unknown;
    assertType<Ret, never>(0);
  });
});
