import type { IsRegistered } from '@/wire/is-registered'
import type { MissingBelow } from '@/wire/missing-below'
import type { MissingDeps } from '@/wire/missing-deps'
import type { Provider } from '@/wire/provider'

import type { Unregistered } from './unregistered'

/**
 * The parameter type of `get`: the provider itself when the container
 * holds it and everything under it, else an error type.
 *
 * The error type names what is not registered or still missing.
 *
 * @typeParam C the container's type, as narrowed at the call
 * @typeParam P the provider asked for
 */
export type Accepted<C, P extends Provider> = [IsRegistered<C, P>] extends [
  true,
]
  ? [MissingBelow<C, P>] extends [never]
    ? P
    : MissingDeps<MissingBelow<C, P>>
  : Unregistered<P>
