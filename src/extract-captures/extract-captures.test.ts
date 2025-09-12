import type { Capture } from "../capture/capture";
import type { ExtractCaptures } from "./extract-captures";
import { assertType } from "../test-utils/assert-type/assert-type";

describe("ExtractCaptures type tests", () => {
  test("type assertions compile", () => {
    // Test 1: Basic extraction
    type TestBasic = ExtractCaptures<
      { value: string },
      { value: Capture<"v"> }
    >;
    assertType<TestBasic, { v: string }>(0);

    // Test 2: Multiple different captures
    type TestMultiple = ExtractCaptures<
      { name: string; age: number },
      { name: Capture<"n">; age: Capture<"a"> }
    >;
    assertType<TestMultiple, { n: string; a: number }>(0);

    // Test 3: Same capture name (compatible types)
    type TestUnification1 = ExtractCaptures<
      { a: number; b: number },
      { a: Capture<"x">; b: Capture<"x"> }
    >;
    assertType<TestUnification1, { x: number }>(0);

    // Test 4: Same capture name (incompatible types) - results in { x: never }
    type TestUnification2 = ExtractCaptures<
      { a: number; b: string },
      { a: Capture<"x">; b: Capture<"x"> }
    >;
    assertType<TestUnification2, { x: never }>(0);

    // Test 5: Nested object extraction
    type TestNested = ExtractCaptures<
      { user: { id: number; name: string } },
      {
        user: {
          id: Capture<"userId">;
          name: Capture<"userName">;
        };
      }
    >;
    assertType<TestNested, { userId: number; userName: string }>(0);

    // Test 6: Arrays
    type TestArray = ExtractCaptures<
      number[],
      [Capture<"first">, Capture<"second">]
    >;
    assertType<TestArray, { first: number; second: number }>(0);

    // Test 7: Optional properties
    type TestOptional = ExtractCaptures<
      { value?: string },
      { value: Capture<"v"> }
    >;
    assertType<TestOptional, { v: string | undefined }>(0);

    // Test 8: Union types
    type TestUnion = ExtractCaptures<
      { value: string | number },
      { value: Capture<"v"> }
    >;
    assertType<TestUnion, { v: string | number }>(0);

    // Test 9: Mixed literals and captures
    type TestMixed = ExtractCaptures<
      { name: string; age: number; active: boolean },
      { name: Capture<"n">; age: 25; active: true }
    >;
    assertType<TestMixed, { n: string }>(0);

    // Test 10: Complex unification
    type TestComplex = ExtractCaptures<
      {
        user: { id: number; name: string };
        selectedId: number;
      },
      {
        user: { id: Capture<"id">; name: "Alice" };
        selectedId: Capture<"id">;
      }
    >;
    assertType<TestComplex, { id: number }>(0);

    expect(true).toBe(true);
  });
});
