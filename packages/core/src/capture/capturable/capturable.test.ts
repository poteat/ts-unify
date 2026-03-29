import type { Capturable } from "./capturable";
import type { CaptureLike } from "@/capture/capture-like";
import { assertType } from "@/test-utils/assert-type";

describe("Capturable", () => {
  it("is T | CaptureLike<T>", () => {
    type T = string;
    type Expected = string | CaptureLike<string>;
    type Actual = Capturable<T>;
    assertType<Actual, Expected>(0);
    assertType<Expected, Actual>(0);
  });
});
