import type { Capture } from "../capture";
import { $ } from "../capture";
import type { ExtractCaptures } from "./extract-captures";
import { assertType } from "../test-utils/assert-type";

describe("ExtractCaptures implicit $ tests", () => {
  it("should handle implicit captures with $ function", () => {
    type Pattern = { name: typeof $; age: typeof $ };
    type Result = ExtractCaptures<Pattern>;
    assertType<Result, { name: unknown; age: unknown }>(0);
  });

  it("should handle nested implicit captures", () => {
    type Pattern = { user: { id: typeof $; name: typeof $ } };
    type Result = ExtractCaptures<Pattern>;
    assertType<Result, { id: unknown; name: unknown }>(0);
  });

  it("should handle root-level $ (no captures extracted)", () => {
    type Pattern = typeof $;
    type Result = ExtractCaptures<Pattern>;
    // Root-level $ doesn't extract anything without context
    assertType<Result, {}>(0);
  });

  it("should handle mixed implicit and explicit captures", () => {
    type Pattern = {
      id: Capture<"userId">;
      name: typeof $;
      age: typeof $;
    };
    type Result = ExtractCaptures<Pattern>;
    assertType<Result, { userId: unknown; name: unknown; age: unknown }>(0);
  });

  it("should handle deeply nested implicit captures", () => {
    type Pattern = {
      user: {
        profile: {
          name: typeof $;
          age: typeof $;
        };
      };
    };
    type Result = ExtractCaptures<Pattern>;
    assertType<Result, { name: unknown; age: unknown }>(0);
  });

  it("should handle arrays with implicit captures", () => {
    type Pattern = [typeof $, typeof $, Capture<"third">];
    type Result = ExtractCaptures<Pattern>;
    assertType<Result, { "0": unknown; "1": unknown; third: unknown }>(0);
  });

  it("should handle optional properties with implicit captures", () => {
    type Pattern = { name?: typeof $; age: typeof $ };
    type Result = ExtractCaptures<Pattern>;
    assertType<Result, { name: unknown; age: unknown }>(0);
  });

  it("should handle union types with implicit captures", () => {
    type Pattern = { value: typeof $ | string | number };
    type Result = ExtractCaptures<Pattern>;
    assertType<Result, { value: unknown }>(0);
  });

  it("should handle same-named implicit captures", () => {
    type Pattern = { a: { x: typeof $ }; b: { x: typeof $ } };
    type Result = ExtractCaptures<Pattern>;
    assertType<Result, { x: unknown }>(0);
  });

  it("should handle multiple occurrences of same implicit capture", () => {
    type Pattern = {
      first: { value: typeof $ };
      second: { value: typeof $ };
      third: Capture<"value">;
    };
    type Result = ExtractCaptures<Pattern>;
    assertType<Result, { value: unknown }>(0);
  });
});
