import type { OrCombinator } from "@/ast/or";
import type { Capture } from "@/capture";
import type { FluentNode } from "@/ast/fluent-node";
import type { ExtractCaptures } from "@/pattern";

describe("U.or typing (type-level)", () => {
  it("unions branch node shapes and capture bags", () => {
    type N1 = { type: "ReturnStatement"; argument: Capture<"a"> };
    type N2 = { type: "IfStatement"; test: Capture<"t"> };

    function check(or: OrCombinator, b1: FluentNode<N1>, b2: FluentNode<N2>) {
      const out = or(b1, b2);
      // Returned type is a branded union of branches; presence is sufficient
      // Bag derivation compiles
      type NodeShape = Omit<typeof out, "when" | "to">;
      type Bag = ExtractCaptures<NodeShape>;
      void (0 as unknown as Bag);
    }
    void check;
  });
});
