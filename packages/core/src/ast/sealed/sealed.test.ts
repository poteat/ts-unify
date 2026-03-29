import type { Capture } from "@/capture";
import type { Sealed } from "./sealed";
import { assertType } from "@/test-utils/assert-type/assert-type";

describe("Sealed brand (type-level)", () => {
  it("preserves original fields while adding a brand", () => {
    type Inner = { a: number; b: string };
    type S = Sealed<Inner>;
    // Original fields remain the same types
    assertType<S["a"], number>(0);
    assertType<S["b"], string>(0);
  });

  it("can be used to mark a single-capture subtree", () => {
    type Inner = { type: "ReturnStatement"; argument: Capture<"x", number> };
    type S = Sealed<Inner>;
    // Structural access to existing fields still works
    type Arg = S["argument"];
    void (null as unknown as Arg);
  });
});
