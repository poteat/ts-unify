import type { Accepted } from '@/wire/accepted'
import type { Get } from '@/wire/get'
import IsProvider from '@/wire/is-provider'
import type { Provider } from '@/wire/provider'

import Errors from './errors'
import type { Resolve } from './resolve'
import type { Root } from './root'

/**
 * A set of providers and the values they build: each built once, on first
 * use, in any registration order. Providers are keyed by reference.
 *
 * `R` is the tuple `wire` passed, or what one `register` assertion added;
 * membership is read through `accepts`, never `R`, since each assertion
 * intersects a fresh `Container<[P]>` onto the binding's type.
 *
 * @typeParam R the registered providers, as a tuple of their types
 * @typeParam Parent the scope this one falls back to
 */
export class Container<
  R extends readonly Provider[] = [],
  Parent extends Root = Root,
> {
  /**
   * A phantom: the registered providers, and the parent's, in a
   * contravariant position.
   *
   * An intersection of narrowed types then reads as any member accepting,
   * and a union as every branch accepting.
   */
  readonly accepts?: ((provider: R[number]) => void) &
    NonNullable<Parent['accepts']>

  private readonly own: Set<Provider>
  private readonly memo = new Map<Provider, unknown>()
  private readonly building = new Set<Provider>()

  /**
   * A scope over its own providers, falling back to a parent's door for
   * any other.
   *
   * @param providers the providers this scope holds
   * @param parent the enclosing scope's door, when there is one
   */
  constructor(
    providers: readonly Provider[] = [],
    private readonly parent?: Resolve,
  ) {
    this.own = new Set(providers)
  }

  /**
   * Adds a provider, and narrows the binding this is called on to one
   * that accepts it. The binding needs an explicit type annotation.
   *
   * @param provider the provider to add
   */
  register<P extends Provider>(
    provider: P,
  ): asserts this is Container<[...R, P], Parent> {
    this.own.add(provider)
  }

  /**
   * The value a provider builds, built on first use. Only a provider this
   * scope or a parent holds, with its dependencies, is accepted.
   *
   * @param provider the provider to read
   * @throws when a dependency is unregistered or part of a cycle
   */
  get<P extends Provider>(provider: Accepted<this, P>): ReturnType<P> {
    if (IsProvider.isProvider(provider)) return this.read<P>(provider)

    throw new TypeError('get takes a provider function')
  }

  /**
   * A child scope holding its own providers apart from this memo, and
   * falling back to this scope for the rest.
   *
   * @param providers the providers the child holds
   */
  scope<const S extends readonly Provider[]>(
    ...providers: S
  ): Container<S, this> {
    return new Container<S, this>(providers, (provider, asker) =>
      this.resolve(provider, asker),
    )
  }

  /**
   * The one typed door over the memo: what it holds is `unknown`, and the
   * provider's return type is the promise the cast takes it at.
   *
   * @param provider the provider to read
   * @param asker the provider asking, for an error's sake
   */
  private read<P extends Provider>(provider: Provider, asker?: Provider) {
    return this.resolve(provider, asker) as ReturnType<P>
  }

  /**
   * The getter a provider is handed: each read names it as the asker.
   *
   * @param asker the provider being built
   */
  private hand(asker: Provider): Get<readonly Provider[]> {
    return provider => this.read<typeof provider>(provider, asker)
  }

  private resolve(provider: Provider, asker?: Provider): unknown {
    if (this.own.has(provider)) return this.build(provider, asker)
    if (this.parent !== undefined) return this.parent(provider, asker)

    throw Errors.unregisteredError(provider, asker)
  }

  private build(provider: Provider, asker?: Provider): unknown {
    if (this.memo.has(provider)) return this.memo.get(provider)
    if (this.building.has(provider)) throw Errors.cycleError(provider, asker)
    this.building.add(provider)

    try {
      const value = provider(this.hand(provider))
      this.memo.set(provider, value)

      return value
    } finally {
      this.building.delete(provider)
    }
  }
}
