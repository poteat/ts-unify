# Container

The runtime behind `wire`, and an imperative form of it.

## Usage

```typescript
const container: Container = new Container()
container.register(clock)
container.register(greeting)
container.get(greeting)
```

## Narrowing

`register` is an assertion: `asserts this is Container<[...R, P]>`. The
binding needs an explicit type annotation, and the assertion is resolved
against that declared type, so each call intersects a fresh
`Container<[P]>` onto the binding's narrowed type:

```
Container<[]> & Container<[typeof clock]> & Container<[typeof greeting]>
```

Nothing reads `R` back out of that intersection; the members are read off
the `accepts` phantom, a function in contravariant position. On an
intersection the phantom is an overload set, and a provider is registered
when any overload takes it. On a union, which a conditional `register`
leaves behind, every branch must take it. So after

```typescript
container.register(clock)
if (flag) container.register(greeting)
```

`get(clock)` is accepted and `get(greeting)` is not.

## get

`get` takes `Accepted<this, P>`: `P` itself when the container holds it and
everything reachable from its declared dependencies; otherwise
`Unregistered<P>` or `MissingDeps<M>` with the missing providers in `M`,
so the argument fails to type-check with them named. The walk down the
dependencies carries what it has visited, so a cycle ends it.

## scope

`scope(...providers)` is a child `Container<S, this>`: it builds its own
providers in its own memo and falls back to the parent for the rest, so a
per-request value is built per scope while the parent's values are shared.
The child's `accepts` is its own intersected with the parent's.

## Runtime

A `Set` of providers, a `Map` memo, and a `Set` of providers being built.
`resolve` reads the memo or builds; a provider found in the building set
is a cycle. The one cast sits in `read`, where the memo's `unknown`
becomes the provider's return type.
