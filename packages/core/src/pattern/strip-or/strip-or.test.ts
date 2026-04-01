import { assertType } from "@/test-utils/assert-type/assert-type";
import type { StripOr } from "./strip-or";
import type { OR_BRAND } from "@/ast/or";

describe("StripOr", () => {
  it("removes OR_BRAND from a branded type", () => {
    type Branded = { a: number; readonly [OR_BRAND]: true };
    type Result = StripOr<Branded>;
    assertType<Result, { a: number }>(0);
  });

  it("returns unbranded types unchanged", () => {
    type Plain = { a: number; b: string };
    type Result = StripOr<Plain>;
    assertType<Result, { a: number; b: string }>(0);
  });

  it("handles an empty branded object", () => {
    type Branded = { readonly [OR_BRAND]: true };
    // eslint-disable-next-line @typescript-eslint/ban-types
    type Result = StripOr<Branded>;
    assertType<Result, {}>(0);
  });
});
