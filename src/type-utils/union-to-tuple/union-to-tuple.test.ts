import { assertType } from "../../test-utils/assert-type/assert-type";
import type { UnionToTuple } from "./union-to-tuple";

describe("UnionToTuple", () => {
  it("should convert union to tuple", () => {
    type Union = "a" | "b" | "c";
    type Result = UnionToTuple<Union>;
    type HasAllMembers = "a" extends Result[number]
      ? "b" extends Result[number]
        ? "c" extends Result[number]
          ? true
          : false
        : false
      : false;
    assertType<HasAllMembers, true>(0);
  });

  it("should handle empty union", () => {
    type Empty = never;
    type Result = UnionToTuple<Empty>;
    assertType<Result, []>(0);
  });

  it("should handle single element", () => {
    type Single = "only";
    type Result = UnionToTuple<Single>;
    assertType<Result, ["only"]>(0);
  });

  it("should handle number unions", () => {
    type Numbers = 1 | 2 | 3;
    type Result = UnionToTuple<Numbers>;
    type HasAll = 1 extends Result[number]
      ? 2 extends Result[number]
        ? 3 extends Result[number]
          ? true
          : false
        : false
      : false;
    assertType<HasAll, true>(0);
  });
});
