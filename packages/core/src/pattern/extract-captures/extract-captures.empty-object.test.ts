import type { ExtractCaptures } from "./extract-captures";
import { assertType } from "@/test-utils/assert-type";

describe("ExtractCaptures with empty object", () => {
  it("treats {} as neutral (no captures) instead of never", () => {
    type Result = ExtractCaptures<{}>;
    assertType<Result, {}>(0);
  });
});
