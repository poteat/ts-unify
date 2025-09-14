import { assertType } from "@/test-utils/assert-type/assert-type";
import type { Prettify } from "./prettify";

describe("Prettify", () => {
  it("should flatten intersection types", () => {
    type Intersected = { a: 1 } & { b: 2 };
    type Result = Prettify<Intersected>;
    assertType<Result, { a: 1; b: 2 }>(0);
  });

  it("should preserve single object types", () => {
    type Single = { a: 1; b: 2 };
    type Result = Prettify<Single>;
    assertType<Result, { a: 1; b: 2 }>(0);
  });

  it("should handle multiple intersections", () => {
    type A = { a: 1 };
    type B = { b: 2 };
    type C = { c: 3 };
    type Result = Prettify<A & B & C>;
    assertType<Result, { a: 1; b: 2; c: 3 }>(0);
  });
});
