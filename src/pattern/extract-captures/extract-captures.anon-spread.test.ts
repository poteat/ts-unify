import type { Capture, Spread } from "@/capture";
import type { ExtractCaptures } from "./extract-captures";
import { assertType } from "@/test-utils/assert-type/assert-type";

describe("ExtractCaptures for anonymous sequence spread", () => {
  it("re-keys anonymous spread to the containing property key", () => {
    type Pattern = { body: readonly [Spread<"">, Capture<"x", number>] };
    type R = ExtractCaptures<Pattern>;
    type Expected = { body: ReadonlyArray<unknown>; x: number };
    assertType<R, Expected>(0);
  });
});

