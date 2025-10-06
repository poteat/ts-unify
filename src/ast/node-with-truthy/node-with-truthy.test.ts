import type { NodeWithTruthy } from "@/ast/node-with-truthy";
import type { Capture } from "@/capture";
import { assertType } from "@/test-utils/assert-type/assert-type";

describe("NodeWithTruthy (type-level)", () => {
  it("narrows the single capture to Truthy<...>", () => {
    type Node = {
      type: "ReturnStatement";
      argument: Capture<"arg", string | 0 | null | "">;
    };
    type N = Node & NodeWithTruthy<Node>;

    function check(n: N) {
      const narrowed = n.truthy();
      type ArgVal = Omit<typeof narrowed, "truthy">["argument"] extends Capture<
        "arg",
        infer V
      >
        ? V
        : never;
      assertType<ArgVal, string>(0);
    }
    void check;
  });

  it("is not callable for zero- or multi-capture nodes", () => {
    type Zero = { type: "X" } & NodeWithTruthy<{ type: "X" }>;
    type Many = {
      type: "Y";
      a: Capture<"a">;
      b: Capture<"b">;
    } & NodeWithTruthy<{
      type: "Y";
      a: Capture<"a">;
      b: Capture<"b">;
    }>;

    function check(z: Zero, m: Many) {
      // @ts-expect-error: zero-capture nodes are gated out
      z.truthy();
      // @ts-expect-error: multi-capture nodes are gated out
      m.truthy();
    }
    void check;
  });
});

