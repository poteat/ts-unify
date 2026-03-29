import type { NodeWithDefault } from "@/ast/node-with-default";
import type { Capture } from "@/capture";
import type { TSESTree } from "@typescript-eslint/types";
import { assertType } from "@/test-utils/assert-type";

describe("NodeWithDefault (type-level)", () => {
  it("provides default for single capture and applies to node shape", () => {
    type N = {
      type: "ReturnStatement";
      argument: Capture<"arg", TSESTree.Expression | undefined>;
    };
    type NM = NodeWithDefault<N>;

    function check(n: NM) {
      const expr = {
        type: "Identifier",
        name: "undefined",
      } as TSESTree.Identifier;
      const withDefault = n.default(expr);
      type NodePart = Omit<typeof withDefault, "default">;
      type ArgValue = NodePart["argument"] extends Capture<"arg", infer V>
        ? V
        : never;
      // The value type maps to an Expression category
      assertType<ArgValue, TSESTree.Expression>(0);
    }
    void check;
  });

  it("is unavailable when multiple captures are present (param is never)", () => {
    type N = {
      type: "X";
      aField: Capture<"a", TSESTree.Expression | undefined>;
      bField: Capture<"b", TSESTree.Expression | undefined>;
    };
    type NM = NodeWithDefault<N>;

    // The parameter type of `.default` should be never via overload
    type DefaultParam = NM["default"] extends (arg: infer A) => any ? A : unknown;
    assertType<DefaultParam, never>(0);
  });
});
