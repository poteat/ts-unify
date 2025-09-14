import type { $ as DollarFn } from "@/capture";
import { $ } from "./dollar";
import type { Capture } from "@/capture/capture-type";
import type { Spread } from "@/capture";
import { assertType } from "@/test-utils/assert-type";

describe("$ type alias", () => {
  it("exports a function type compatible with typeof $", () => {
    type FnFromType = DollarFn;
    type FnFromValue = typeof $;
    assertType<FnFromType, FnFromValue>(0);
    assertType<FnFromValue, FnFromType>(0);
  });

  it("supports explicit Value generic parameter", () => {
    const capture = $<"id", number>("id");
    type C = typeof capture;
    type Expected = Capture<"id", number> & Iterable<Spread<"id", number>>;
    assertType<C, Expected>(0);
  });

  it("defaults Value generic parameter to unknown", () => {
    const capture = $("name");
    type C = typeof capture;
    type Expected = Capture<"name", unknown> & Iterable<Spread<"name", unknown>>;
    assertType<C, Expected>(0);
  });
});
