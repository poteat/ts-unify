import type { Overwrite } from "@/type-utils/overwrite";
// Extends-based checks to avoid overly strict exact-equality pitfalls
const assertExtends = <T extends U, U>(_v?: T) => 0 as const;

describe("Overwrite type util", () => {
  it("overwrites colliding keys", () => {
    type A = { a: number };
    type B = { a: string };
    type R = Overwrite<A, B>;
    assertExtends<R, { a: string }>();
    assertExtends<{ a: string }, R>();
  });

  it("adds new keys when no collision", () => {
    type A = { a: number };
    type B = { b: string };
    type R = Overwrite<A, B>;
    assertExtends<R, { a: number; b: string }>();
    assertExtends<{ a: number; b: string }, R>();
  });
});
