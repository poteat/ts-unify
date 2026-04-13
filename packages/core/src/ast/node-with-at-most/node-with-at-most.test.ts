import { U } from "@/ast";

describe("NodeWithAtMost (type-level)", () => {
  it("preserves chainability after .atMost()", () => {
    const p = U.ThisExpression().atMost(2);
    void p;
  });

  it("chains after .until()", () => {
    const p = U.ThisExpression()
      .until(U.FunctionDeclaration())
      .atMost(2);
    void p;
  });
});
