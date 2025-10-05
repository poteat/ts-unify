import type { NormalizeCaptured } from "@/ast/normalize-captured";
import type { FluentNode } from "@/ast/fluent-node";
import type { TSESTree } from "@typescript-eslint/types";
import { assertType } from "@/test-utils/assert-type";

describe("NormalizeCaptured (type-level)", () => {
  it("unwraps FluentNode and rehydrates tagged shapes, collapsing to categories", () => {
    type N = { type: "Literal"; value: string };
    type F = FluentNode<N>;
    type Out = NormalizeCaptured<F>;
    assertType<Out, TSESTree.Expression>(0);
  });

  it("collapses statements to Statement and expressions to Expression", () => {
    type S = NormalizeCaptured<{ type: "ReturnStatement" }>;
    type E = NormalizeCaptured<{ type: "CallExpression" }>;
    assertType<S, TSESTree.Statement>(0);
    assertType<E, TSESTree.Expression>(0);
  });

  it("passes through non-AST types unchanged", () => {
    type X = NormalizeCaptured<number>;
    assertType<X, number>(0);
  });
});

