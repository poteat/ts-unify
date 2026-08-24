import type { Capture } from '@/capture'
import type { StringPredicate } from '@/string-predicate'
import AssertType from '@/test-utils/assert-type'

import type { ExtractCaptures } from './extract-captures'

describe('ExtractCaptures type tests', () => {
  test('type assertions compile', () => {
    // Test 1: Basic extraction (implicit value => unknown)
    type TestBasic = ExtractCaptures<{ value: Capture<'v'> }>
    AssertType.assertType<TestBasic, { v: unknown }>(0)

    // A RegExp in a string position contributes no capture
    type TestRegExp = ExtractCaptures<{ value: Capture<'v'>; name: RegExp }>
    AssertType.assertType<TestRegExp, { v: unknown }>(0)

    // A string predicate in a string position contributes no capture
    type TestPredicate = ExtractCaptures<{
      value: Capture<'v'>
      name: StringPredicate
    }>
    AssertType.assertType<TestPredicate, { v: unknown }>(0)

    // Test 2: Multiple different captures (implicit values => unknown)
    type TestMultiple = ExtractCaptures<{
      name: Capture<'n'>
      age: Capture<'a'>
    }>
    AssertType.assertType<TestMultiple, { n: unknown; a: unknown }>(0)

    // Test 3: Same capture name (multiple occurrences)
    type TestUnification1 = ExtractCaptures<{
      a: Capture<'x'>
      b: Capture<'x'>
    }>
    AssertType.assertType<TestUnification1, { x: unknown }>(0)

    // Test 4: Same capture name in different contexts
    type TestUnification2 = ExtractCaptures<{
      data: { value: Capture<'x'> }
      other: Capture<'x'>
    }>
    AssertType.assertType<TestUnification2, { x: unknown }>(0)

    // Test 5: Nested object extraction
    type TestNested = ExtractCaptures<{
      user: {
        id: Capture<'userId'>
        name: Capture<'userName'>
      }
    }>
    AssertType.assertType<TestNested, { userId: unknown; userName: unknown }>(0)

    // Test 6: Arrays
    type TestArray = ExtractCaptures<[Capture<'first'>, Capture<'second'>]>
    AssertType.assertType<TestArray, { first: unknown; second: unknown }>(0)

    // Test 7: Capture in optional position
    type TestOptional = ExtractCaptures<{ value?: Capture<'v'> }>
    AssertType.assertType<TestOptional, { v: unknown }>(0)

    // Test 8: Mixed pattern
    type TestMixed = ExtractCaptures<{
      value: Capture<'v'> | string | number
    }>
    AssertType.assertType<TestMixed, { v: unknown }>(0)

    // Test 9: Mixed literals and captures
    type TestMixedPattern = ExtractCaptures<{
      name: Capture<'n'>
      age: 25
      active: true
    }>
    AssertType.assertType<TestMixedPattern, { n: unknown }>(0)

    // Test 10: Complex nested pattern
    type TestComplex = ExtractCaptures<{
      user: { id: Capture<'id'>; name: 'Alice' }
      selectedId: Capture<'id'>
      metadata: {
        tags: [Capture<'tag1'>, Capture<'tag2'>]
      }
    }>
    AssertType.assertType<
      TestComplex,
      { id: unknown; tag1: unknown; tag2: unknown }
    >(0)

    // Test 11: Explicit typed capture propagates value type
    type TestTyped = ExtractCaptures<{ value: Capture<'v', number> }>
    AssertType.assertType<TestTyped, { v: number }>(0)

    // Test 12: Same name with different explicit value types intersects
    type TestIntersect = ExtractCaptures<{
      a: Capture<'x', number>
      b: Capture<'x', string>
    }>
    AssertType.assertType<TestIntersect, { x: number & string }>(0)

    expect(true).toBe(true)
  })
})
