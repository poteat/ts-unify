import Spread from '@/capture/spread'

/**
 * Gives an object a non-enumerable iterator yielding one spread token, so
 * `[...token]` is a slice capture and `{ ...token }` copies nothing of it.
 *
 * @param target capture token or the `$` function itself
 * @param name name of the slice; empty for the anonymous `...$`
 */
export const defineSpreadIterator = <Name extends string, Value>(
  target: object,
  name: Name,
): void => {
  Object.defineProperty(target, Symbol.iterator, {
    enumerable: false,
    configurable: false,
    writable: false,
    value: function* (): IterableIterator<Spread.Spread<Name, Value>> {
      yield {
        [Spread.SPREAD_BRAND]: true,
        name,
      } as unknown as Spread.Spread<Name, Value>
    },
  })
}
