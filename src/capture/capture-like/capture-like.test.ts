import type { Capture } from "@/capture";
import type { $ } from "@/capture";
import type { CaptureLike } from "./capture-like";
import { assertType } from "@/test-utils/assert-type";

describe("CaptureLike", () => {
  it("is equivalent to the union of placeholder and explicit capture", () => {
    type U = $ | Capture;
    assertType<CaptureLike, U>(0);
    assertType<U, CaptureLike>(0);
  });
});
