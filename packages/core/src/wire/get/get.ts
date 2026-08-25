import type { Provider } from '@/wire/provider'

/**
 * The getter handed to a provider: it takes only the providers in `Deps`
 * and returns what each one builds.
 *
 * @typeParam Deps the providers the caller declared, as a tuple of types
 */
export type Get<Deps extends readonly Provider[]> = <P extends Deps[number]>(
  provider: P,
) => ReturnType<P>
