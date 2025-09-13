import { assertType } from "../../test-utils/assert-type/assert-type";
import type { LastOf } from "./last-of";

describe("LastOf", () => {
  it("should extract a union member", () => {
    type Union = 1 | 2 | 3;
    type Result = LastOf<Union>;
    type IsOneOfUnion = Result extends Union ? true : false;
    assertType<IsOneOfUnion, true>(0);
  });

  it("should handle single element", () => {
    type Single = "only";
    type Result = LastOf<Single>;
    assertType<Result, "only">(0);
  });

  it("should work with object unions", () => {
    type Union = { a: 1 } | { b: 2 };
    type Result = LastOf<Union>;
    type IsOneOfUnion = Result extends Union ? true : false;
    assertType<IsOneOfUnion, true>(0);
  });
});
