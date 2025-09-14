import type { BindCaptures } from "@/capture";
import type { Capture } from "@/capture";
import { $ } from "@/capture";
import { assertType } from "@/test-utils/assert-type";

describe("BindCaptures - type-level", () => {
  it("binds implicit $ to named captures based on shape", () => {
    type Shape = { id: number; name: string; nested: { flag: boolean } };
    type Pattern = { id: $; name: "Alice"; nested: { flag: $ } };
    type Result = BindCaptures<Pattern, Shape>;
    type Expected = {
      id: Capture<"id", number>;
      name: "Alice";
      nested: { flag: Capture<"flag", boolean> };
    };
    assertType<Result, Expected>(0);
  });

  it("preserves explicit capture and upgrades unknown to shape type", () => {
    type Shape = { value: number; text: string };
    type Pattern1 = {
      value: Capture<"v", number>;
      text: Capture<"t", unknown>;
    };
    type Result1 = BindCaptures<Pattern1, Shape>;
    type Expected1 = {
      value: Capture<"v", number>;
      text: Capture<"t", string>;
    };
    assertType<Result1, Expected1>(0);
  });

  it("allows explicit captures anywhere in the pattern", () => {
    type Shape = { a: number; b: { c: string } };
    type Pattern = { a: Capture<"x", unknown>; b: { c: $ } };
    type Result = BindCaptures<Pattern, Shape>;
    type Expected = { a: Capture<"x", number>; b: { c: Capture<"c", string> } };
    assertType<Result, Expected>(0);
  });

  it("binds root-level $ across object shape", () => {
    type Shape = { a: number; b: string };
    type Pattern = $;
    type Result = BindCaptures<Pattern, Shape>;
    type Expected = { a: Capture<"a", number>; b: Capture<"b", string> };
    assertType<Result, Expected>(0);
  });

  it("binds root-level $ across tuple shape", () => {
    type Shape = [number, string];
    type Pattern = $;
    type Result = BindCaptures<Pattern, Shape>;
    type Expected = [Capture<"0", number>, Capture<"1", string>];
    assertType<Result, Expected>(0);
  });

  it("binds root-level $ across array shape", () => {
    type Shape = string[];
    type Pattern = $;
    type Result = BindCaptures<Pattern, Shape>;
    type Expected = readonly Capture<`${number}`, string>[];
    assertType<Result, Expected>(0);
  });
});
