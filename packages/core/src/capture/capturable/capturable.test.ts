import type { Capturable } from "./capturable";
import type { CaptureLike } from "@/capture/capture-like";
import type { ConfigSlot } from "@/config/config-type";
import { assertType } from "@/test-utils/assert-type";

describe("Capturable", () => {
  it("is T | CaptureLike<T> | ConfigSlot", () => {
    type T = string;
    type Expected = string | CaptureLike<string> | ConfigSlot;
    type Actual = Capturable<T>;
    assertType<Actual, Expected>(0);
    assertType<Expected, Actual>(0);
  });
});
