/**
 * A value a test expects to be there; a null or undefined throws, so the
 * test fails where the value was looked for.
 *
 * @param value the value, or nothing
 * @param what what the value is, for the error
 */
export function present<T>(value: T | null | undefined, what: string): T {
  if (!value) throw new Error(`expected ${what}`)

  return value
}
