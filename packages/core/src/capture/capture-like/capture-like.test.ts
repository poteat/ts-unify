import type { Capture } from "@/capture";
import type { $ } from "@/capture";
import type { CaptureLike } from "./capture-like";
import { assertType } from "@/test-utils/assert-type";

describe("CaptureLike", () => {
  it("default CaptureLike is $ | Capture<string, unknown>", () => {
    type U = $ | Capture;
    assertType<CaptureLike, U>(0);
    assertType<U, CaptureLike>(0);
  });
});
