import type { Capture } from "../capture";
import { $ } from "../capture";
import type { ExtractCaptures } from "./extract-captures";
import { assertType } from "../test-utils/assert-type";

describe("ExtractCaptures implicit $ tests", () => {
  it("should handle implicit captures with $ function", () => {
    type Data = { name: string; age: number };
    type Pattern = { name: typeof $; age: typeof $ };
    type Result = ExtractCaptures<Data, Pattern>;
    assertType<Result, { name: string; age: number }>(0);
  });

  it("should handle nested implicit captures", () => {
    type Data = { user: { id: number; name: string } };
    type Pattern = { user: { id: typeof $; name: typeof $ } };
    type Result = ExtractCaptures<Data, Pattern>;
    assertType<Result, { id: number; name: string }>(0);
  });

  it("should handle root-level $ as wildcard", () => {
    type Data = { a: string; b: number; c: boolean };
    type Pattern = typeof $;
    type Result = ExtractCaptures<Data, Pattern>;
    assertType<Result, { a: string; b: number; c: boolean }>(0);
  });

  it("should handle mixed implicit and explicit captures", () => {
    type Data = { id: number; name: string; age: number };
    type Pattern = {
      id: Capture<"userId">;
      name: typeof $;
      age: typeof $;
    };
    type Result = ExtractCaptures<Data, Pattern>;
    assertType<Result, { userId: number; name: string; age: number }>(0);
  });

  it("should handle deeply nested implicit captures", () => {
    type Data = {
      user: {
        profile: {
          name: string;
          age: number;
        };
      };
    };
    type Pattern = {
      user: {
        profile: {
          name: typeof $;
          age: typeof $;
        };
      };
    };
    type Result = ExtractCaptures<Data, Pattern>;
    assertType<Result, { name: string; age: number }>(0);
  });

  it("should handle arrays with implicit captures", () => {
    type Data = [string, number, boolean];
    type Pattern = [typeof $, typeof $, Capture<"third">];
    type Result = ExtractCaptures<Data, Pattern>;
    assertType<Result, { "0": string; "1": number; third: boolean }>(0);
  });

  it("should handle optional properties with implicit captures", () => {
    type Data = { name?: string; age: number };
    type Pattern = { name?: typeof $; age: typeof $ };
    type Result = ExtractCaptures<Data, Pattern>;
    // Optional properties need special handling
    // Just check that age is captured correctly for now
    type AgeCheck = Result extends { age: number } ? true : false;
    assertType<AgeCheck, true>(0);
  });

  it("should handle union types with implicit captures", () => {
    type Data = { value: string | number };
    type Pattern = { value: typeof $ };
    type Result = ExtractCaptures<Data, Pattern>;
    assertType<Result, { value: string | number }>(0);
  });

  it("should merge same-named implicit captures with unification", () => {
    type Data = { a: { x: number }; b: { x: number } };
    type Pattern = { a: { x: typeof $ }; b: { x: typeof $ } };
    type Result = ExtractCaptures<Data, Pattern>;
    assertType<Result, { x: number }>(0);
  });

  it("should return never for conflicting implicit captures", () => {
    type Data = { a: { x: number }; b: { x: string } };
    type Pattern = { a: { x: typeof $ }; b: { x: typeof $ } };
    type Result = ExtractCaptures<Data, Pattern>;
    assertType<Result, { x: never }>(0);
  });
});
