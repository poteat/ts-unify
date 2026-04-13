import { U } from "@/ast";

describe("NodeWithSome (type-level)", () => {
  it("preserves chainability after .some()", () => {
    const p = U.ThisExpression().some();
    void p;
  });

  it("chains after .until()", () => {
    const p = U.ThisExpression()
      .until(U.FunctionDeclaration())
      .some();
    void p;
  });
});
