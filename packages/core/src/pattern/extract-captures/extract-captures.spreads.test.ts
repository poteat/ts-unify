import type { Spread } from "@/capture";
import type { ExtractCaptures } from "./extract-captures";
import { assertType } from "@/test-utils/assert-type";

describe("ExtractCaptures with spread tokens (type-level)", () => {
  it("extracts spread as readonly array of its element type", () => {
    type Pattern = ["x", Spread<"rest", number>, "y"];
    type Result = ExtractCaptures<Pattern>;
    assertType<Result, { rest: ReadonlyArray<number> }>(0);
  });

  it("intersects duplicate spread names across pattern", () => {
    type Pattern = [Spread<"xs", string>, Spread<"xs", string | number>];
    type Result = ExtractCaptures<Pattern>;
    assertType<
      Result,
      { xs: ReadonlyArray<string> & ReadonlyArray<string | number> }
    >(0);
  });
});

