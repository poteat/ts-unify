import { U } from "@/ast";

describe("NodeWithNone (type-level)", () => {
  it("preserves chainability after .none()", () => {
    const p = U.ThisExpression().none();
    void p;
  });

  it("chains after .until()", () => {
    const p = U.ThisExpression()
      .until(U.FunctionDeclaration())
      .none();
    void p;
  });
});
