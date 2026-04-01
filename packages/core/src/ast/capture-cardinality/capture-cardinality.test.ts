import { assertType } from "@/test-utils/assert-type/assert-type";
import type {
  HasZeroCaptures,
  HasSingleCapture,
  HasManyCaptures,
} from "./capture-cardinality";
import type { Capture } from "@/capture/capture-type";

describe("HasZeroCaptures", () => {
  it("returns true for a node with no captures", () => {
    type Node = { type: "Identifier"; name: "foo" };
    assertType<HasZeroCaptures<Node>, true>(0);
  });

  it("returns false when a capture is present", () => {
    type Node = { type: "ReturnStatement"; argument: Capture<"arg"> };
    assertType<HasZeroCaptures<Node>, false>(0);
  });
});

describe("HasSingleCapture", () => {
  it("returns true for exactly one capture", () => {
    type Node = { type: "ReturnStatement"; argument: Capture<"arg"> };
    assertType<HasSingleCapture<Node>, true>(0);
  });

  it("returns false for zero captures", () => {
    type Node = { type: "Identifier"; name: "foo" };
    assertType<HasSingleCapture<Node>, false>(0);
  });

  it("returns false for multiple captures", () => {
    type Node = { a: Capture<"x">; b: Capture<"y"> };
    assertType<HasSingleCapture<Node>, false>(0);
  });
});

describe("HasManyCaptures", () => {
  it("returns true for two or more captures", () => {
    type Node = { a: Capture<"x">; b: Capture<"y"> };
    assertType<HasManyCaptures<Node>, true>(0);
  });

  it("returns false for zero captures", () => {
    type Node = { type: "Identifier"; name: "foo" };
    assertType<HasManyCaptures<Node>, false>(0);
  });

  it("returns false for a single capture", () => {
    type Node = { type: "ReturnStatement"; argument: Capture<"arg"> };
    assertType<HasManyCaptures<Node>, false>(0);
  });
});
