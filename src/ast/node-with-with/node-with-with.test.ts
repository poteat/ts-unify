import type { NodeWithWith } from "@/ast/node-with-with";
import type { Capture } from "@/capture";
import type { ExtractCaptures } from "@/pattern";
import { assertType } from "@/test-utils/assert-type";

describe("NodeWithWith (type-level)", () => {
  it("overwrites colliding keys and merges new keys into bag", () => {
    type N = {
      type: "X";
      a: Capture<"a", number>;
      b: Capture<"b", string>;
    };
    type NW = NodeWithWith<N>;

    function check(n: NW) {
      const out = n.with((_bag: { a: number; b: string }) => ({
        a: 123 as const,
        c: true as const,
      }));

      // Node shape substitution: capture 'a' value becomes 123
      type NodePart = Omit<typeof out, "with">;
      type AVal = NodePart["a"] extends Capture<"a", infer V> ? V : never;
      assertType<AVal, 123>(0);

      // Bag seen by downstream `.to` reflects overwrite and the added key
      type Bag = ExtractCaptures<typeof out>;
      assertType<Bag, { a: 123; b: string; c: true }>(0);
    }
    void check;
  });
});
