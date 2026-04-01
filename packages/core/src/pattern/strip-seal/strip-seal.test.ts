import { assertType } from "@/test-utils/assert-type/assert-type";
import type { StripSeal } from "./strip-seal";
import type { Sealed } from "@/ast/sealed";

describe("StripSeal", () => {
  it("unwraps Sealed brand", () => {
    type Inner = { type: "ReturnStatement"; argument: unknown };
    type Wrapped = Sealed<Inner>;
    type Result = StripSeal<Wrapped>;
    assertType<Result, Inner>(0);
  });

  it("returns non-sealed types unchanged", () => {
    type Plain = { type: "Identifier"; name: string };
    type Result = StripSeal<Plain>;
    assertType<Result, Plain>(0);
  });

  it("returns primitives unchanged", () => {
    type Result = StripSeal<string>;
    assertType<Result, string>(0);
  });
});
