import type { NodeWithTo } from "@/ast/node-with-to";
import type { AstTransform } from "@/ast/ast-transform";
import type { Capture } from "@/capture";

describe("NodeWithTo typing (terminal)", () => {
  it("exposes .to that returns an AstTransform", () => {
    type Node = {
      type: "ReturnStatement";
      argument: Capture<"arg", string | number>;
    };

    type N = Node & NodeWithTo<Node>;

    function check(n: N) {
      const p = n.to<number>((bag) => {
        void bag;
        return 1;
      });
      // The exact shape is opaque; compile-time only usage check.
      void (p as AstTransform<Node, number>);
    }
    void check;
  });
});
