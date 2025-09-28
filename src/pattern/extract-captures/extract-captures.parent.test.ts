import type { $ } from "@/capture";
import { assertType } from "@/test-utils/assert-type";
import type { ExtractCaptures } from "@/pattern";

describe("ExtractCaptures: ignores 'parent' property (enforcement-only)", () => {
  it("extracts captures from nested parent pattern", () => {
    type P = { parent: { id: $ } };
    type Bag = ExtractCaptures<P>;
    type Expected = { id: unknown };
    assertType<Bag, Expected>(0);
  });
});
