import { $, isCapture } from "./capture";
import { expectType } from "../test-utils/expect-type/expect-type";

describe("capture", () => {
  test("$ creates capture", () => {
    const c = $("foo");
    expectType(c.name).toBe("foo");
    expect(isCapture(c)).toBe(true);
  });

  test("isCapture rejects non-captures", () => {
    expect(isCapture(null)).toBe(false);
    expect(isCapture(undefined)).toBe(false);
    expect(isCapture(42)).toBe(false);
    expect(isCapture("string")).toBe(false);
    expect(isCapture({})).toBe(false);
    expect(isCapture({ name: "foo" })).toBe(false);
  });
});
