import type { NodeWithWhen } from "@/ast/node-with-when";
import type { Capture } from "@/capture";
import { assertType } from "@/test-utils/assert-type";


describe("NodeWithWhen narrowing (type-level)", () => {
  it("narrows single capture via value guard and applies to node shape", () => {
    type Node = {
      type: "ReturnStatement";
      argument: Capture<"arg", string | number>;
    };
    type NW = NodeWithWhen<Node>;

    function check(res: NW) {
      const narrowed = res.when(
        (x: string | number): x is string => {
          void x;
          return true;
        }
      );
      type NodePart = Omit<typeof narrowed, "when">;
      type ArgValue = NodePart["argument"] extends Capture<"arg", infer V>
        ? V
        : never;
      assertType<ArgValue, string>(0);
    }
    void check;
  });

  it("narrows multiple captures via bag guard and applies to shape", () => {
    type Node = {
      type: "X";
      aField: Capture<"a", number | null>;
      bField: Capture<"b", string | number>;
    };
    type NW = NodeWithWhen<Node>;

    function check(res: NW) {
      const narrowed = res.when(
        (bag: { a: number | null; b: string | number }): bag is {
          a: number;
          b: string;
        } => {
          void bag;
          return true;
        }
      );
      type NodePart = Omit<typeof narrowed, "when">;
      type AVal = NodePart["aField"] extends Capture<"a", infer V> ? V : never;
      type BVal = NodePart["bField"] extends Capture<"b", infer V> ? V : never;
      assertType<AVal, number>(0);
      assertType<BVal, string>(0);
    }
    void check;
  });
});
