import { U } from "@/ast";

describe("NodeWithAtLeast (type-level)", () => {
  it("preserves chainability after .atLeast()", () => {
    const p = U.ThisExpression().atLeast(3);
    void p;
  });

  it("chains after .until()", () => {
    const p = U.ThisExpression()
      .until(U.FunctionDeclaration())
      .atLeast(3);
    void p;
  });
});
