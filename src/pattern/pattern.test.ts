import type { Pattern } from ".";
import { $ } from "@/capture";
import type { Spread } from "@/capture";
import { SPREAD_BRAND } from "@/capture/spread/spread";

describe("Pattern type", () => {
  it("accepts original shape", () => {
    type Shape = { x: number; y: { z: string }; tup: [number, string] };
    const p: Pattern<Shape> = {
      x: 1,
      y: { z: "a" },
      tup: [1, "b"],
    };
    expect(typeof p).toBe("object");
  });

  it("accepts implicit placeholders", () => {
    type Shape = { x: number; y: { z: string }; tup: [number, string] };
    const p: Pattern<Shape> = {
      x: $,
      y: { z: $ },
      tup: [$, $],
    };
    expect(typeof p).toBe("object");
  });

  it("accepts spread token in sequence position (type-level)", () => {
    type Shape = readonly number[];
    const rest = { [SPREAD_BRAND]: true, name: "rest" } as Spread<
      "rest",
      number
    >;
    const p: Pattern<Shape> = [rest];
    expect(Array.isArray(p)).toBe(true);
  });

  it("accepts explicit captures", () => {
    type Shape = { x: number; y: string; tup: [number, string] };
    const p: Pattern<Shape> = {
      x: $("x"),
      y: $("y"),
      tup: [$("0"), $("1")],
    };
    expect(typeof p).toBe("object");
  });

  it("allows omitting object keys (loose patterns)", () => {
    type Shape = { id: number; user: { name: string; active: boolean } };
    const p1: Pattern<Shape> = { id: $("id") };
    const p2: Pattern<Shape> = { user: { name: $ } };
    expect(typeof p1).toBe("object");
    expect(typeof p2).toBe("object");
  });

  it("rejects extra keys not in the shape", () => {
    type Shape = { id: number };
    // @ts-expect-error - extra property not in Shape
    const bad: Pattern<Shape> = { id: $("id"), extra: true };
    void bad;
    expect(true).toBe(true);
  });
});
