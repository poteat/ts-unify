import type { NodeWithTo } from "@/ast/node-with-to";
import type { AstTransform } from "@/ast/ast-transform";
import type { Capture } from "@/capture";
import type { Node as ConcreteNode } from "@typescript-eslint/types/dist/generated/ast-spec";
import type { WithoutInternalAstFields } from "@/type-utils";

describe("NodeWithTo typing (terminal)", () => {
  it("exposes .to that returns an AstTransform", () => {
    type Node = {
      type: "ReturnStatement";
      argument: Capture<"arg", string | number>;
    };

    type N = Node & NodeWithTo<Node>;

    function check(n: N) {
      const p = n.to<WithoutInternalAstFields<ConcreteNode>>((bag) => {
        void bag;
        return {
          type: "ReturnStatement",
          argument: {
            type: "Identifier",
            name: "result",
          },
        } as WithoutInternalAstFields<ConcreteNode>;
      });
      // The exact shape is opaque; compile-time only usage check.
      void (p as AstTransform<Node, WithoutInternalAstFields<ConcreteNode>>);
    }
    void check;
  });
});
