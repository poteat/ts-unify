import { assertType } from "../../test-utils/assert-type";
import type { Capture } from "./capture-type";
import { CAPTURE_BRAND } from "./capture-type";

describe("Capture type", () => {
  it("should preserve literal name types", () => {
    type TestCapture = Capture<"test">;
    type Name = TestCapture["name"];
    assertType<Name, "test">(0);
  });

  it("should have the brand property", () => {
    type TestCapture = Capture<"test">;
    type Brand = TestCapture[typeof CAPTURE_BRAND];
    assertType<Brand, true>(0);
  });

  it("should default to string when no name provided", () => {
    type GenericCapture = Capture;
    type Name = GenericCapture["name"];
    assertType<Name, string>(0);
  });
});
