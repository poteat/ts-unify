import type { NodeWithBind } from "@/ast/node-with-bind";
import type { ExtractCaptures } from "@/pattern";
import type { Capture } from "@/capture";
import type { TSESTree } from "@typescript-eslint/types";
import { assertType } from "@/test-utils/assert-type";
import { SEALED_BRAND } from "@/ast/sealed";

describe("NodeWithBind (type-level)", () => {
  it("bind(name) clears existing capture bag entries", () => {
    type Node = {
      type: "BlockStatement";
      body: readonly [
        {
          type: "ExpressionStatement";
          expression: Capture<"expr", TSESTree.Expression>;
        }
      ];
    };

    function check(node: NodeWithBind<Node>) {
      const bound = node.bind("block");
      type Bag = ExtractCaptures<typeof bound>;
      type Keys = keyof Bag;
      assertType<Keys, "block">(0);
      assertType<"block", Keys>(0);
      type Value = Bag["block"];
      type HasType = Value extends { type: string } ? true : false;
      assertType<HasType, true>(0);
    }
    void check;
  });

  it("bind() uses the canonical name and applies Sealed", () => {
    type Node = {
      type: "BlockStatement";
      body: readonly [
        {
          type: "ExpressionStatement";
          expression: Capture<"expr", TSESTree.Expression>;
        }
      ];
    };

    function check(node: NodeWithBind<Node>) {
      const bound = node.bind();
      type Bag = ExtractCaptures<typeof bound>;
      type Keys = keyof Bag;
      assertType<Keys, "node">(0);
      assertType<"node", Keys>(0);
      type Value = Bag["node"];
      type HasType = Value extends { type: string } ? true : false;
      assertType<HasType, true>(0);
      type IsSealed = typeof bound extends { readonly [SEALED_BRAND]: true }
        ? true
        : false;
      assertType<IsSealed, true>(0);
    }
    void check;
  });

  it("with() adds new keys without restoring removed captures", () => {
    type Node = {
      type: "BlockStatement";
      body: readonly [
        {
          type: "ExpressionStatement";
          expression: Capture<"expr", TSESTree.Expression>;
        }
      ];
    };

    function check(node: NodeWithBind<Node>) {
      const withSize = node
        .bind("block")
        .with(({ block }) => ({ size: block.type.length }));
      type Bag = ExtractCaptures<typeof withSize>;
      type Keys = keyof Bag;
      assertType<Keys, "block" | "size">(0);
      assertType<"block" | "size", Keys>(0);
      type BlockValue = Bag["block"];
      type HasType = BlockValue extends { type: string } ? true : false;
      assertType<HasType, true>(0);
      type SizeValue = Bag["size"];
      assertType<SizeValue, number>(0);
    }
    void check;
  });
});
