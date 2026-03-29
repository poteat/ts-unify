import type { ConfigSlot } from "@/config/config-type";
import type { Capture } from "@/capture";
import type { ExtractConfig } from "./extract-config";
import { assertType } from "@/test-utils/assert-type/assert-type";

describe("ExtractConfig type tests", () => {
  test("type assertions compile", () => {
    // Test 1: Basic extraction (implicit value => unknown)
    type TestBasic = ExtractConfig<{ theme: ConfigSlot<"theme"> }>;
    assertType<TestBasic, { theme: unknown }>(0);

    // Test 2: Explicit value type
    type TestTyped = ExtractConfig<{ retries: ConfigSlot<"retries", number> }>;
    assertType<TestTyped, { retries: number }>(0);

    // Test 3: Multiple config slots
    type TestMultiple = ExtractConfig<{
      theme: ConfigSlot<"theme", string>;
      retries: ConfigSlot<"retries", number>;
    }>;
    assertType<TestMultiple, { theme: string; retries: number }>(0);

    // Test 4: Nested object extraction
    type TestNested = ExtractConfig<{
      settings: {
        theme: ConfigSlot<"theme", string>;
        display: {
          fontSize: ConfigSlot<"fontSize", number>;
        };
      };
    }>;
    assertType<TestNested, { theme: string; fontSize: number }>(0);

    // Test 5: Array extraction
    type TestArray = ExtractConfig<
      [ConfigSlot<"first">, ConfigSlot<"second">]
    >;
    assertType<TestArray, { first: unknown; second: unknown }>(0);

    // Test 6: Mixed pattern with literals (non-config values ignored)
    type TestMixed = ExtractConfig<{
      theme: ConfigSlot<"theme", string>;
      version: 42;
      active: true;
    }>;
    assertType<TestMixed, { theme: string }>(0);

    // Test 7: Coexistence with captures (captures ignored)
    type TestCoexist = ExtractConfig<{
      id: Capture<"id">;
      theme: ConfigSlot<"theme", string>;
      name: Capture<"name">;
      retries: ConfigSlot<"retries", number>;
    }>;
    assertType<TestCoexist, { theme: string; retries: number }>(0);

    // Test 8: Empty pattern (no config slots)
    type TestEmpty = ExtractConfig<{ name: "Alice"; age: 25 }>;
    assertType<TestEmpty, {}>(0);

    // Test 9: Deeply nested with captures and config coexisting
    type TestDeepCoexist = ExtractConfig<{
      user: {
        id: Capture<"userId">;
        preferences: {
          theme: ConfigSlot<"theme", string>;
        };
      };
      settings: {
        maxRetries: ConfigSlot<"maxRetries", number>;
      };
    }>;
    assertType<TestDeepCoexist, { theme: string; maxRetries: number }>(0);

    expect(true).toBe(true);
  });
});
