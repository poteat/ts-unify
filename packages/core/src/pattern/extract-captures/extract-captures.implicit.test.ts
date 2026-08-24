import SrcCapture from '@/capture'
import type { Capture } from '@/capture'
import AssertType from '@/test-utils/assert-type'

import type { ExtractCaptures } from './extract-captures'

describe('ExtractCaptures implicit $ tests', () => {
  it('should handle implicit captures with $ function', () => {
    type Pattern = { name: SrcCapture.$; age: SrcCapture.$ }
    type Result = ExtractCaptures<Pattern>
    AssertType.assertType<Result, { name: unknown; age: unknown }>(0)
  })

  it('should handle nested implicit captures', () => {
    type Pattern = { user: { id: SrcCapture.$; name: SrcCapture.$ } }
    type Result = ExtractCaptures<Pattern>
    AssertType.assertType<Result, { id: unknown; name: unknown }>(0)
  })

  it('should handle root-level $ (no captures extracted)', () => {
    type Pattern = SrcCapture.$
    type Result = ExtractCaptures<Pattern>
    // Root-level $ doesn't extract anything without context
    AssertType.assertType<Result, {}>(0)
  })

  it('should handle mixed implicit and explicit captures', () => {
    type Pattern = {
      id: Capture<'userId'>
      name: SrcCapture.$
      age: SrcCapture.$
    }
    type Result = ExtractCaptures<Pattern>
    AssertType.assertType<
      Result,
      { userId: unknown; name: unknown; age: unknown }
    >(0)
  })

  it('should handle deeply nested implicit captures', () => {
    type Pattern = {
      user: {
        profile: {
          name: SrcCapture.$
          age: SrcCapture.$
        }
      }
    }
    type Result = ExtractCaptures<Pattern>
    AssertType.assertType<Result, { name: unknown; age: unknown }>(0)
  })

  it('should handle arrays with implicit captures', () => {
    type Pattern = [SrcCapture.$, SrcCapture.$, Capture<'third'>]
    type Result = ExtractCaptures<Pattern>
    AssertType.assertType<
      Result,
      { '0': unknown; '1': unknown; third: unknown }
    >(0)
  })

  it('should handle optional properties with implicit captures', () => {
    type Pattern = { name?: SrcCapture.$; age: SrcCapture.$ }
    type Result = ExtractCaptures<Pattern>
    AssertType.assertType<Result, { name: unknown; age: unknown }>(0)
  })

  it('should handle union types with implicit captures', () => {
    type Pattern = { value: SrcCapture.$ | string | number }
    type Result = ExtractCaptures<Pattern>
    AssertType.assertType<Result, { value: unknown }>(0)
  })

  it('should handle same-named implicit captures', () => {
    type Pattern = { a: { x: SrcCapture.$ }; b: { x: SrcCapture.$ } }
    type Result = ExtractCaptures<Pattern>
    AssertType.assertType<Result, { x: unknown }>(0)
  })

  it('should handle multiple occurrences of same implicit capture', () => {
    type Pattern = {
      first: { value: SrcCapture.$ }
      second: { value: SrcCapture.$ }
      third: Capture<'value'>
    }
    type Result = ExtractCaptures<Pattern>
    AssertType.assertType<Result, { value: unknown }>(0)
  })
})
