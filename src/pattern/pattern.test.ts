import type { Pattern } from ".";
import { $ } from "@/capture";

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

  it("accepts explicit captures", () => {
    type Shape = { x: number; y: string; tup: [number, string] };
    const p: Pattern<Shape> = {
      x: $("x"),
      y: $("y"),
      tup: [$("0"), $("1")],
    };
    expect(typeof p).toBe("object");
  });
});
