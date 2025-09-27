import type { KeysOfUnion } from "@/type-utils";
import { assertType } from "@/test-utils/assert-type/assert-type";

describe("KeysOfUnion - type-level", () => {
  it("unions keys across variants", () => {
    type U = { a: 1 } | { b: 2 } | { c: 3 };
    type K = KeysOfUnion<U>;
    type Expected = "a" | "b" | "c";
    assertType<K, Expected>(0);
  });

  it("includes keys shared across variants only once (union)", () => {
    type U = { common: 1; a: 1 } | { common: 2; b: 2 };
    type K = KeysOfUnion<U>;
    type Expected = "common" | "a" | "b";
    assertType<K, Expected>(0);
  });

  it("reduces to keyof for non-unions", () => {
    type T = { x: number; y: string };
    type K = KeysOfUnion<T>;
    type Expected = keyof T; // "x" | "y"
    assertType<K, Expected>(0);
  });
});
