import type { Capture } from '@/capture'
import type { ConfigSlot } from '@/config/config-type'
import AssertType from '@/test-utils/assert-type'

import type { ExtractConfig } from './extract-config'

describe('extract-config', () => {
  it('reads an implicit value as unknown', () => {
    type TestBasic = ExtractConfig<{ theme: ConfigSlot<'theme'> }>
    AssertType.assertType<TestBasic, { theme: unknown }>(0)
  })

  it('keeps an explicit value type', () => {
    type TestTyped = ExtractConfig<{ retries: ConfigSlot<'retries', number> }>
    AssertType.assertType<TestTyped, { retries: number }>(0)
  })

  it('collects several slots into one bag', () => {
    type TestMultiple = ExtractConfig<{
      theme: ConfigSlot<'theme', string>
      retries: ConfigSlot<'retries', number>
    }>
    AssertType.assertType<TestMultiple, { theme: string; retries: number }>(0)
  })

  it('reaches slots in nested objects', () => {
    type TestNested = ExtractConfig<{
      settings: {
        theme: ConfigSlot<'theme', string>
        display: {
          fontSize: ConfigSlot<'fontSize', number>
        }
      }
    }>
    AssertType.assertType<TestNested, { theme: string; fontSize: number }>(0)
  })

  it('reaches slots in a tuple', () => {
    type TestArray = ExtractConfig<[ConfigSlot<'first'>, ConfigSlot<'second'>]>
    AssertType.assertType<TestArray, { first: unknown; second: unknown }>(0)
  })

  it('leaves literal values out of the bag', () => {
    type TestMixed = ExtractConfig<{
      theme: ConfigSlot<'theme', string>
      version: 42
      isActive: true
    }>
    AssertType.assertType<TestMixed, { theme: string }>(0)
  })

  it('leaves captures out of the bag', () => {
    type TestCoexist = ExtractConfig<{
      id: Capture<'id'>
      theme: ConfigSlot<'theme', string>
      name: Capture<'name'>
      retries: ConfigSlot<'retries', number>
    }>
    AssertType.assertType<TestCoexist, { theme: string; retries: number }>(0)
  })

  it('gives an empty bag for a pattern with no slots', () => {
    type TestEmpty = ExtractConfig<{ name: 'Alice'; age: 25 }>
    AssertType.assertType<TestEmpty, {}>(0)
  })

  it('reaches slots nested beside captures', () => {
    type TestDeepCoexist = ExtractConfig<{
      user: {
        id: Capture<'userId'>
        preferences: {
          theme: ConfigSlot<'theme', string>
        }
      }
      settings: {
        maxRetries: ConfigSlot<'maxRetries', number>
      }
    }>
    AssertType.assertType<
      TestDeepCoexist,
      { theme: string; maxRetries: number }
    >(0)
  })
})
