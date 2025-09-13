import type { Capture } from "../capture";
import type { ExtractCaptures } from "./extract-captures";
import { assertType } from "../test-utils/assert-type/assert-type";

describe("ExtractCaptures type tests", () => {
  test("type assertions compile", () => {
    // Test 1: Basic extraction
    type TestBasic = ExtractCaptures<{ value: Capture<"v"> }>;
    assertType<TestBasic, { v: unknown }>(0);

    // Test 2: Multiple different captures
    type TestMultiple = ExtractCaptures<{
      name: Capture<"n">;
      age: Capture<"a">;
    }>;
    assertType<TestMultiple, { n: unknown; a: unknown }>(0);

    // Test 3: Same capture name (multiple occurrences)
    type TestUnification1 = ExtractCaptures<{
      a: Capture<"x">;
      b: Capture<"x">;
    }>;
    assertType<TestUnification1, { x: unknown }>(0);

    // Test 4: Same capture name in different contexts
    type TestUnification2 = ExtractCaptures<{
      data: { value: Capture<"x"> };
      other: Capture<"x">;
    }>;
    assertType<TestUnification2, { x: unknown }>(0);

    // Test 5: Nested object extraction
    type TestNested = ExtractCaptures<{
      user: {
        id: Capture<"userId">;
        name: Capture<"userName">;
      };
    }>;
    assertType<TestNested, { userId: unknown; userName: unknown }>(0);

    // Test 6: Arrays
    type TestArray = ExtractCaptures<[Capture<"first">, Capture<"second">]>;
    assertType<TestArray, { first: unknown; second: unknown }>(0);

    // Test 7: Capture in optional position
    type TestOptional = ExtractCaptures<{ value?: Capture<"v"> }>;
    assertType<TestOptional, { v: unknown }>(0);

    // Test 8: Mixed pattern
    type TestMixed = ExtractCaptures<{
      value: Capture<"v"> | string | number;
    }>;
    assertType<TestMixed, { v: unknown }>(0);

    // Test 9: Mixed literals and captures
    type TestMixedPattern = ExtractCaptures<{
      name: Capture<"n">;
      age: 25;
      active: true;
    }>;
    assertType<TestMixedPattern, { n: unknown }>(0);

    // Test 10: Complex nested pattern
    type TestComplex = ExtractCaptures<{
      user: { id: Capture<"id">; name: "Alice" };
      selectedId: Capture<"id">;
      metadata: {
        tags: [Capture<"tag1">, Capture<"tag2">];
      };
    }>;
    assertType<TestComplex, { id: unknown; tag1: unknown; tag2: unknown }>(0);

    expect(true).toBe(true);
  });
});
