import type { ExtractCaptures } from "@/pattern";
import { assertType } from "@/test-utils/assert-type/assert-type";
import { U } from "@/ast";
import { $ } from "@/capture";

describe("NodeWithWhere (type-level)", () => {
  it("preserves the capture bag through .where()", () => {
    const pattern = U.FunctionDeclaration({
      id: $("id"),
      body: $("body"),
    }).where(
      U.ThisExpression().none(),
    );
    // The capture bag should still have id and body after .where().
    type Bag = ExtractCaptures<typeof pattern>;
    assertType<keyof Bag, "id" | "body">(0);
  });

  it("chains with .to() after .where()", () => {
    const transform = U.ReturnStatement({ argument: $("expr") })
      .where(U.ThisExpression().none())
      .to(({ expr }) => U.ReturnStatement({ argument: expr }));
    void transform;
  });

  it("accepts multiple constraints", () => {
    const fnBoundary = U.or(U.FunctionDeclaration(), U.FunctionExpression());
    const pattern = U.FunctionDeclaration({ ...$  })
      .where(
        U.ThisExpression().until(fnBoundary).none(),
        U.Identifier({ name: "arguments" }).until(fnBoundary).none(),
      );
    void pattern;
  });
});
