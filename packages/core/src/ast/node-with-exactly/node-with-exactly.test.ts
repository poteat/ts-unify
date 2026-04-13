import { U } from "@/ast";

describe("NodeWithExactly (type-level)", () => {
  it("preserves chainability after .exactly()", () => {
    const p = U.ThisExpression().exactly(1);
    void p;
  });

  it("chains after .until()", () => {
    const p = U.ThisExpression()
      .until(U.FunctionDeclaration())
      .exactly(1);
    void p;
  });
});
