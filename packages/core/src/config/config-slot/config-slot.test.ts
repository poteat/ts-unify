import { assertType } from "@/test-utils/assert-type";
import type { ConfigSlot } from "@/config/config-type";
import { CONFIG_BRAND } from "@/config/config-type";
import { C } from "./config-slot";

describe("C (config slot factory)", () => {
  it("should create a config slot with the given name", () => {
    const slot = C("theme");
    expect(slot.name).toBe("theme");
  });

  it("should set the CONFIG_BRAND to true", () => {
    const slot = C("theme");
    expect(slot[CONFIG_BRAND]).toBe(true);
  });

  it("should return a frozen object", () => {
    const slot = C("theme");
    expect(Object.isFrozen(slot)).toBe(true);
  });

  it("should preserve literal name type", () => {
    const slot = C("maxRetries");
    assertType<typeof slot, ConfigSlot<"maxRetries", unknown>>(0);
  });

  it("should produce distinct objects for different names", () => {
    const a = C("a");
    const b = C("b");
    expect(a.name).not.toBe(b.name);
  });
});
