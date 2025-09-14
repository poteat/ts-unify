import { isCapture } from "./is-capture";
import { $ } from "@/capture";

describe("isCapture", () => {
  it("should return true for capture sentinels", () => {
    const capture = $("test");
    expect(isCapture(capture)).toBe(true);
  });

  it("should return false for regular objects", () => {
    const obj = { name: "test" };
    expect(isCapture(obj)).toBe(false);
  });

  it("should return false for null", () => {
    expect(isCapture(null)).toBe(false);
  });

  it("should return false for undefined", () => {
    expect(isCapture(undefined)).toBe(false);
  });

  it("should return false for primitives", () => {
    expect(isCapture("string")).toBe(false);
    expect(isCapture(123)).toBe(false);
    expect(isCapture(true)).toBe(false);
  });

  it("should narrow types correctly", () => {
    const value: unknown = $("test");
    if (isCapture(value)) {
      // TypeScript should know value.name is accessible
      expect(value.name).toBe("test");
    } else {
      fail("Should have been identified as capture");
    }
  });
});
