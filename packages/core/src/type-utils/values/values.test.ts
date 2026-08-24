import AssertType from '@/test-utils/assert-type'

import type { Values } from './values'

describe('values', () => {
  it('should extract values from basic objects', () => {
    type TestObj = { a: string; b: number; isOn: boolean }
    type Result = Values<TestObj>
    AssertType.assertType<Result, string | number | boolean>(0)
  })

  it('should return never for empty objects', () => {
    type Empty = {}
    type Result = Values<Empty>
    AssertType.assertType<Result, never>(0)
  })

  it('should handle objects with same value types', () => {
    type AllStrings = { name: string; description: string; id: string }
    type Result = Values<AllStrings>
    AssertType.assertType<Result, string>(0)
  })

  it('should include undefined for optional properties', () => {
    type WithOptional = { required: string; optional?: number }
    type Result = Values<WithOptional>
    AssertType.assertType<Result, string | number | undefined>(0)
  })

  it('should extract nested object types', () => {
    type Nested = {
      user: { name: string; age: number }
      settings: { theme: string; isDark: boolean }
    }
    type Result = Values<Nested>
    AssertType.assertType<
      Result,
      { name: string; age: number } | { theme: string; isDark: boolean }
    >(0)
  })

  it('should work with index signatures', () => {
    type StringRecord = { [key: string]: number }
    type Result = Values<StringRecord>
    AssertType.assertType<Result, number>(0)
  })

  it('should handle index signatures with specific properties', () => {
    type IndexWithSpecific = {
      [key: string]: string | number | boolean
      isSpecific: boolean
    }
    type Result = Values<IndexWithSpecific>
    AssertType.assertType<Result, string | number | boolean>(0)
  })

  it('should work with readonly properties', () => {
    type ReadonlyObj = {
      readonly a: string
      readonly b: number
    }
    type Result = Values<ReadonlyObj>
    AssertType.assertType<Result, string | number>(0)
  })

  it('should handle union types in values', () => {
    type UnionValues = {
      status: 'active' | 'inactive'
      count: number | null
    }
    type Result = Values<UnionValues>
    AssertType.assertType<Result, 'active' | 'inactive' | number | null>(0)
  })

  it('should work with discriminated unions', () => {
    type DiscriminatedUnion = {
      success: { type: 'success'; data: string }
      error: { type: 'error'; message: string }
    }
    type Result = Values<DiscriminatedUnion>
    AssertType.assertType<
      Result,
      { type: 'success'; data: string } | { type: 'error'; message: string }
    >(0)
  })

  it('should include the element type among the properties of an array', () => {
    type Result = Values<string[]>
    type HasElement = string extends Result ? true : false
    AssertType.assertType<HasElement, true>(0)
  })

  it('should include each element type among the properties of a tuple', () => {
    type Result = Values<[string, number, boolean]>
    type HasString = string extends Result ? true : false
    type HasNumber = number extends Result ? true : false
    type HasBoolean = boolean extends Result ? true : false
    AssertType.assertType<HasString, true>(0)
    AssertType.assertType<HasNumber, true>(0)
    AssertType.assertType<HasBoolean, true>(0)
  })
})
