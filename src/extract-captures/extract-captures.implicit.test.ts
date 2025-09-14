import type { Capture } from "@/capture";
import { $ } from "@/capture";
import type { ExtractCaptures } from "./extract-captures";
import { assertType } from "@/test-utils/assert-type";

describe("ExtractCaptures implicit $ tests", () => {
  it("should handle implicit captures with $ function", () => {
    type Pattern = { name: $; age: $ };
    type Result = ExtractCaptures<Pattern>;
    assertType<Result, { name: unknown; age: unknown }>(0);
  });

  it("should handle nested implicit captures", () => {
    type Pattern = { user: { id: $; name: $ } };
    type Result = ExtractCaptures<Pattern>;
    assertType<Result, { id: unknown; name: unknown }>(0);
  });

  it("should handle root-level $ (no captures extracted)", () => {
    type Pattern = $;
    type Result = ExtractCaptures<Pattern>;
    // Root-level $ doesn't extract anything without context
    assertType<Result, {}>(0);
  });

  it("should handle mixed implicit and explicit captures", () => {
    type Pattern = {
      id: Capture<"userId">;
      name: $;
      age: $;
    };
    type Result = ExtractCaptures<Pattern>;
    assertType<Result, { userId: unknown; name: unknown; age: unknown }>(0);
  });

  it("should handle deeply nested implicit captures", () => {
    type Pattern = {
      user: {
        profile: {
          name: $;
          age: $;
        };
      };
    };
    type Result = ExtractCaptures<Pattern>;
    assertType<Result, { name: unknown; age: unknown }>(0);
  });

  it("should handle arrays with implicit captures", () => {
    type Pattern = [$, $, Capture<"third">];
    type Result = ExtractCaptures<Pattern>;
    assertType<Result, { "0": unknown; "1": unknown; third: unknown }>(0);
  });

  it("should handle optional properties with implicit captures", () => {
    type Pattern = { name?: $; age: $ };
    type Result = ExtractCaptures<Pattern>;
    assertType<Result, { name: unknown; age: unknown }>(0);
  });

  it("should handle union types with implicit captures", () => {
    type Pattern = { value: $ | string | number };
    type Result = ExtractCaptures<Pattern>;
    assertType<Result, { value: unknown }>(0);
  });

  it("should handle same-named implicit captures", () => {
    type Pattern = { a: { x: $ }; b: { x: $ } };
    type Result = ExtractCaptures<Pattern>;
    assertType<Result, { x: unknown }>(0);
  });

  it("should handle multiple occurrences of same implicit capture", () => {
    type Pattern = {
      first: { value: $ };
      second: { value: $ };
      third: Capture<"value">;
    };
    type Result = ExtractCaptures<Pattern>;
    assertType<Result, { value: unknown }>(0);
  });
});
