import { assertType } from "@/test-utils/assert-type";
import type { ConfigSlot } from "./config-type";
import { CONFIG_BRAND } from "./config-type";

describe("ConfigSlot type", () => {
  it("should preserve literal name types", () => {
    type TestSlot = ConfigSlot<"theme">;
    type Name = TestSlot["name"];
    assertType<Name, "theme">(0);
  });

  it("should have the brand property", () => {
    type TestSlot = ConfigSlot<"theme">;
    type Brand = TestSlot[typeof CONFIG_BRAND];
    assertType<Brand, true>(0);
  });

  it("should default to string when no name provided", () => {
    type GenericSlot = ConfigSlot;
    type Name = GenericSlot["name"];
    assertType<Name, string>(0);
  });

  it("should default value type to unknown", () => {
    type TestSlot = ConfigSlot<"theme">;
    type Value = TestSlot["value"];
    assertType<Value, unknown | undefined>(0);
  });

  it("should preserve explicit value types", () => {
    type TestSlot = ConfigSlot<"maxRetries", number>;
    type Value = TestSlot["value"];
    assertType<Value, number | undefined>(0);
  });
});
