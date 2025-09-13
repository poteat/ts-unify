import { assertType } from "../../test-utils/assert-type/assert-type";
import type { UnionToIntersection } from "./union-to-intersection";

describe("UnionToIntersection", () => {
  it("should convert union to intersection", () => {
    type Union = { a: 1 } | { b: 2 };
    type Result = UnionToIntersection<Union>;
    assertType<Result, { a: 1 } & { b: 2 }>(0);
  });

  it("should handle single type", () => {
    type Single = { a: 1 };
    type Result = UnionToIntersection<Single>;
    assertType<Result, { a: 1 }>(0);
  });

  it("should handle function unions", () => {
    type Union = ((x: string) => void) | ((x: number) => void);
    type Result = UnionToIntersection<Union>;
    assertType<Result, ((x: string) => void) & ((x: number) => void)>(0);
  });

  it("should handle multiple object unions", () => {
    type A = { a: 1 };
    type B = { b: 2 };
    type C = { c: 3 };
    type Result = UnionToIntersection<A | B | C>;
    assertType<Result, A & B & C>(0);
  });
});
