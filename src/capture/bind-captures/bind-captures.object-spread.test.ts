import type { BindCaptures, Capture } from "@/capture";
import { $ } from "@/capture";
import type { DollarObjectSpread } from "@/capture";
import { assertType } from "@/test-utils/assert-type";

describe("BindCaptures with object spread-$ (type-level)", () => {
  it("binds omitted keys when using { ...$, explicit: $ }", () => {
    type Shape = { a: number; b: string };
    type Pattern = { a: $ } & DollarObjectSpread;
    type Bound = BindCaptures<Pattern, Shape>;
    type Expected = { a: Capture<"a", number>; b: Capture<"b", string> };
    assertType<Bound, Expected>(0);
  });

  it("does not capture 'type' from shape extras", () => {
    type Shape = { type: "ReturnStatement"; a: number; b: string };
    type Pattern = { a: Capture<"a", number> } & DollarObjectSpread;
    type Bound = BindCaptures<Pattern, Shape>;
    type Expected = {
      a: Capture<"a", number>;
      b: Capture<"b", string>;
    };
    assertType<Bound, Expected>(0);
  });
});
