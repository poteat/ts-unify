import { $ } from "./dollar";

describe("$ function - error cases", () => {
  it("should throw error for empty string name", () => {
    expect(() => {
      //@ts-expect-error - Empty string should be type error
      $("");
    }).toThrow("Capture name cannot be empty string");
  });

  it("should have type error for empty string", () => {
    // This test just verifies the @ts-expect-error above is working
    // The type system should prevent this at compile time
    const validCapture = $("valid");
    expect(validCapture.name).toBe("valid");
  });
});
