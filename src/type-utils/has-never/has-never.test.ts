import { assertType } from "../../test-utils/assert-type/assert-type";
import type { HasNever } from "./has-never";

describe("HasNever", () => {
  it("should return true for never", () => {
    type Result = HasNever<never>;
    assertType<Result, true>(0);
  });

  it("should return false for non-never types", () => {
    type Result = HasNever<string>;
    assertType<Result, false>(0);
  });

  it("should return false for union with never", () => {
    type Result = HasNever<string | never>;
    assertType<Result, false>(0);
  });

  it("should detect impossible intersections", () => {
    type Impossible = string & number;
    type Result = HasNever<Impossible>;
    assertType<Result, true>(0);
  });
});
