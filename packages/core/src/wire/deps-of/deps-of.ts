import type { Get } from '@/wire/get'
import type { Provider } from '@/wire/provider'

/**
 * The tuple a provider declared through its getter's type, and `[]` for
 * a provider that takes no getter. Distributes over a union.
 *
 * @typeParam P the provider's type
 */
export type DepsOf<P extends Provider> = P extends unknown
  ? Parameters<P> extends []
    ? []
    : P extends (need: Get<infer Deps extends readonly Provider[]>) => unknown
      ? Deps
      : never
  : never
