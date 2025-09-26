import type { Capture } from "@/capture";
import type { ExtractCaptures } from "@/pattern";
import { assertType } from "@/test-utils/assert-type/assert-type";
import type { Sealed } from "@/ast/sealed";

describe("NodeWithSeal (type-level)", () => {
  it("re-keys a single inner capture to the parent property", () => {
    type Inner = { type: "ReturnStatement"; argument: Capture<"arg", number> };
    type Pattern = {
      test: Capture<"t">;
      consequent: Sealed<Inner>;
      alternate: Capture<"a">;
    };
    type Bag = ExtractCaptures<Pattern>;
    assertType<Bag, { t: unknown; consequent: number; a: unknown }>(0);
  });

  it("does not re-key when multiple inner captures exist", () => {
    type Inner = { a: Capture<"a">; b: Capture<"b"> };
    type Pattern = { consequent: Sealed<Inner> };
    type Bag = ExtractCaptures<Pattern>;
    assertType<Bag, { a: unknown; b: unknown }>(0);
  });

  it("no-op re-key for zero inner captures", () => {
    type Inner = { literal: 1 };
    type Pattern = { consequent: Sealed<Inner> };
    type Bag = ExtractCaptures<Pattern>;
    assertType<Bag, {}>(0);
  });
});
