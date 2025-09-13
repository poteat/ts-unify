import { $ } from "./dollar";
import { CAPTURE_BRAND } from "../capture-type";

describe("$ function", () => {
  it("should create a capture with the given name", () => {
    const capture = $("test");
    expect(capture.name).toBe("test");
  });

  it("should have the capture brand", () => {
    const capture = $("test");
    expect(capture[CAPTURE_BRAND]).toBe(true);
  });

  it("should preserve literal types", () => {
    const capture = $("literal");
    type Name = typeof capture.name;
    const typeCheck: Name = "literal";
    expect(typeCheck).toBe("literal");
  });

  it("should create different captures for different names", () => {
    const capture1 = $("first");
    const capture2 = $("second");
    expect(capture1.name).not.toBe(capture2.name);
  });
});
