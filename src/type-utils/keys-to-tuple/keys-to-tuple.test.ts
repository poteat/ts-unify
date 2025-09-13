import { assertType } from "../../test-utils/assert-type/assert-type";
import type { KeysToTuple } from "./keys-to-tuple";

describe("KeysToTuple", () => {
  it("should convert object keys to tuple", () => {
    type Obj = { a: 1; b: 2; c: 3 };
    type Result = KeysToTuple<Obj>;
    type HasAllKeys = "a" extends Result[number]
      ? "b" extends Result[number]
        ? "c" extends Result[number]
          ? true
          : false
        : false
      : false;
    assertType<HasAllKeys, true>(0);
  });

  it("should return empty tuple for non-object", () => {
    type Result = KeysToTuple<string>;
    assertType<Result, []>(0);
  });

  it("should handle empty object", () => {
    type Empty = {};
    type Result = KeysToTuple<Empty>;
    assertType<Result, []>(0);
  });

  it("should handle single key", () => {
    type Single = { only: true };
    type Result = KeysToTuple<Single>;
    assertType<Result, ["only"]>(0);
  });
});
