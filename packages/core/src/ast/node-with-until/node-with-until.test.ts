import { U } from "@/ast";

describe("NodeWithUntil (type-level)", () => {
  it("preserves chainability after .until()", () => {
    // .until() returns FluentNode<N> — further chaining is valid.
    const p = U.ThisExpression().until(U.FunctionDeclaration());
    // Can chain .none() after .until()
    const q = U.ThisExpression().until(U.FunctionDeclaration()).none();
    // Suppress unused warnings
    void p;
    void q;
  });

  it("accepts U.or() as a boundary", () => {
    const p = U.ThisExpression().until(
      U.or(U.FunctionDeclaration(), U.FunctionExpression())
    );
    void p;
  });
});
