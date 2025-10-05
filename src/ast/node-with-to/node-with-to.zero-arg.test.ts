import type { NodeWithTo } from "@/ast/node-with-to";
import type { AstTransform } from "@/ast/ast-transform";
import type { Capture } from "@/capture";
import type { TSESTree } from "@typescript-eslint/types";

describe("NodeWithTo zero-arg sugar (single-capture)", () => {
  it("allows zero-arg .to() when there is exactly one capture", () => {
    type Node = {
      type: "ReturnStatement";
      argument: Capture<"expr", TSESTree.Expression>;
    };

    type N = Node & NodeWithTo<Node>;

    function check(n: N) {
      const p = n.to();
      // The exact shape is opaque; compile-time only usage check.
      void (p as AstTransform<Node, TSESTree.Expression>);
    }
    void check;
  });

  it("disables zero-arg .to() for zero captures", () => {
    type Node = {
      type: "Identifier";
      name: string;
    };

    type N = Node & NodeWithTo<Node>;

    function check(n: N) {
      // @ts-expect-error zero-arg sugar gated to single-capture only
      n.to();
    }
    void check;
  });

  it("disables zero-arg .to() for multiple captures", () => {
    type Node = {
      type: "IfStatement";
      test: Capture<"t", TSESTree.Expression>;
      consequent: Capture<"c", TSESTree.Statement>;
    };

    type N = Node & NodeWithTo<Node>;

    function check(n: N) {
      // @ts-expect-error zero-arg sugar gated to single-capture only
      n.to();
    }
    void check;
  });
});

