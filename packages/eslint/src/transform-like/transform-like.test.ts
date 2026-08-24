import { U, $ } from "@ts-unify/core";
import type { TransformLike, MatchLike } from "./transform-like";

const id = U.Identifier({ name: $("n") });
const rewrite = U.Identifier({ name: $("n") }).to(({ n }) => U.Identifier({ name: n }));
const either = U.or(U.ExportAllDeclaration({}), U.Identifier({}));

describe("TransformLike", () => {
  it("accepts a bare pattern and a pattern with .to()", () => {
    const bare: MatchLike = id;
    const asTransform: TransformLike = bare;
    const withTo: TransformLike = rewrite;
    const union: TransformLike = either;
    expect([asTransform, withTo, union].every((v) => v != null)).toBe(true);
  });
});
