import Container from '@/wire/container'
import IsProvider from '@/wire/is-provider'
import type { Provider } from '@/wire/provider'
import type { Wired } from '@/wire/wired'

/**
 * A container over the providers given, in any order.
 *
 * The call type-checks only when every provider any of them declares is
 * among them; a missing one is named in the error on the first argument.
 *
 * @param providers the providers, each a function that is its own token
 */
export function wire<const R extends readonly Provider[]>(
  ...providers: Wired<R>
): Container.Container<R> {
  if (providers.every(IsProvider.isProvider)) {
    return new Container.Container<R>(providers)
  }

  throw new TypeError('wire takes provider functions')
}
