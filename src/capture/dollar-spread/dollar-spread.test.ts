import type { DollarObjectSpread } from "@/capture";
import { $ } from "@/capture";
import { assertType } from "@/test-utils/assert-type";

describe("DollarObjectSpread brand", () => {
  it("typeof $ includes DollarObjectSpread for object spread contexts", () => {
    type T = typeof $;
    type U = DollarObjectSpread;
    // typeof $ should be compatible with the brand for intersection usage
    assertType<T, T & U>(0);
  });
});

