import { assertType } from "@/test-utils/assert-type/assert-type";
import type { CoalesceUnionOfBags } from "./coalesce-union-of-bags";

describe("CoalesceUnionOfBags", () => {
  it("merges disjoint keys from a union of bags", () => {
    type Bags = { a: number } | { b: string };
    type Result = CoalesceUnionOfBags<Bags>;
    assertType<Result, { a: number; b: string }>(0);
  });

  it("unions value types for overlapping keys", () => {
    type Bags = { a: number } | { a: string; b: boolean };
    type Result = CoalesceUnionOfBags<Bags>;
    assertType<Result, { a: number | string; b: boolean }>(0);
  });

  it("handles a single-member union (identity)", () => {
    type Bags = { x: number; y: string };
    type Result = CoalesceUnionOfBags<Bags>;
    assertType<Result, { x: number; y: string }>(0);
  });

  it("handles three-member union", () => {
    type Bags = { a: 1 } | { a: 2; b: 3 } | { c: 4 };
    type Result = CoalesceUnionOfBags<Bags>;
    assertType<Result, { a: 1 | 2; b: 3; c: 4 }>(0);
  });
});
