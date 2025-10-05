import type { FluentNode } from "@/ast/fluent-node";
import type { UnwrapFluent } from "@/ast/unwrap-fluent";
import { assertType } from "@/test-utils/assert-type";

describe("UnwrapFluent (type-level)", () => {
  it("unwraps FluentNode<N> to N", () => {
    type N = { type: "X" };
    type F = FluentNode<N>;
    type U = UnwrapFluent<F>;
    assertType<U, N>(0);
  });

  it("passes through non-fluent types unchanged", () => {
    type T = string | number;
    type U = UnwrapFluent<T>;
    assertType<U, T>(0);
  });
});

