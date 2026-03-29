import type { OrCombinator } from "@/ast/or";
import type { Capture } from "@/capture";
import type { ExtractCaptures } from "@/pattern";
import { assertType } from "@/test-utils/assert-type";

describe("U.or literal-path overload (type-level)", () => {
  it("returns a plain union for literals-only", () => {
    function check(or: OrCombinator) {
      const out = or("a" as const, "b" as const, 42 as const);
      type T = typeof out;
      assertType<T, "a" | "b" | 42>(0);
    }
    void check;
  });

  it("ExtractCaptures works on union of literal and capture object", () => {
    type N1 = { tag: "K"; value: Capture<"x"> };
    type Bag = ExtractCaptures<N1 | "noop">;
    assertType<Bag, {} | { x: unknown }>(0);
  });
});
