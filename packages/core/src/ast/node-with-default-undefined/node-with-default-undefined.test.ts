import type { NodeWithDefaultUndefined } from "@/ast/node-with-default-undefined";
import type { Capture } from "@/capture";
import type { TSESTree } from "@typescript-eslint/types";
import { assertType } from "@/test-utils/assert-type";

describe("NodeWithDefaultUndefined (type-level)", () => {
  it("provides undefined default for single capture and applies to node shape", () => {
    type N = {
      type: "ReturnStatement";
      argument: Capture<"arg", TSESTree.Expression | undefined>;
    };
    type NM = NodeWithDefaultUndefined<N>;

    function check(n: NM) {
      const withDefault = n.defaultUndefined();
      type NodePart = Omit<typeof withDefault, "defaultUndefined">;
      type ArgValue = NodePart["argument"] extends Capture<"arg", infer V>
        ? V
        : never;
      assertType<ArgValue, TSESTree.Expression>(0);
    }
    void check;
  });

  it("is unavailable when multiple captures are present (returns never)", () => {
    type N = {
      type: "X";
      aField: Capture<"a", TSESTree.Expression | undefined>;
      bField: Capture<"b", TSESTree.Expression | undefined>;
    };
    type NM = NodeWithDefaultUndefined<N>;

    type Ret = NM["defaultUndefined"] extends () => infer R ? R : unknown;
    assertType<Ret, never>(0);
  });
});
