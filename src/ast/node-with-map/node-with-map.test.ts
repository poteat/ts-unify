import type { NodeWithMap } from "@/ast/node-with-map";
import type { Capture } from "@/capture";
import { assertType } from "@/test-utils/assert-type";

describe("NodeWithMap (type-level)", () => {
  it("maps single capture value and applies to node shape", () => {
    type N = { type: "ReturnStatement"; argument: Capture<"arg", string | null> };
    type NM = NodeWithMap<N>;

    function check(n: NM) {
      const mapped = n.map((x: string | null) => String(x ?? "fallback"));
      type NodePart = Omit<typeof mapped, "map">;
      type ArgValue = NodePart["argument"] extends Capture<"arg", infer V>
        ? V
        : never;
      assertType<ArgValue, string>(0);
    }
    void check;
  });

  it("maps multiple captures via bag and applies to shape", () => {
    type N = {
      type: "X";
      aField: Capture<"a", number | null>;
      bField: Capture<"b", string | number>;
    };
    type NM = NodeWithMap<N>;

    function check(n: NM) {
      const mapped = n.map((bag: { a: number | null; b: string | number }) => ({
        a: numberOrNullToString(bag.a),
        b: 42 as const,
      }));
      type NodePart = Omit<typeof mapped, "map">;
      type AVal = NodePart["aField"] extends Capture<"a", infer V> ? V : never;
      type BVal = NodePart["bField"] extends Capture<"b", infer V> ? V : never;
      assertType<AVal, string>(0);
      assertType<BVal, 42>(0);
    }

    function numberOrNullToString(x: number | null): string {
      return String(x);
    }
    void check;
  });
});
