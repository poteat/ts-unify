# wire

Builds a `Container` over a list of providers.

## Usage

```typescript
const clock = () => ({ now: Date.now() })
const greeting = (need: Get<[typeof clock]>) => `hello at ${need(clock).now}`

const container = wire(clock, greeting)
container.get(greeting) // string
```

## Purpose

A provider is a plain function, `make(need) => Api`, and is its own token:
the container keys on it by reference, and its type is `typeof make`. It
declares what it needs through the type of its getter parameter, a tuple
of provider types, and `Get<Deps>` takes only those.

`wire` is variadic and infers the tuple exactly (a `const` type parameter).
Order is irrelevant: values are built lazily, on first `get`, and once.

## Completeness

`Missing<R>` is every provider some member of `R` declares that `R` does
not hold. When it is not `never`, the rest parameter's type is
`readonly MissingDeps<Missing<R>>[]` instead of `R`, so the call fails on
its first argument with the missing provider named:

```
Argument of type '() => { now: number }' is not assignable to parameter of
type 'MissingDeps<() => { name: string }>'.
```

Membership is structural: two providers of one return type satisfy each
other in `Missing`, though the container keeps them apart at runtime.

## Runtime

- A cycle throws an `Error` naming the provider asked for and the one that
  asked: `pong needs ping, which is still being built`.
- A provider nothing registered throws `clock is not registered (asked for
  by greeting)`; the type level refuses the call first.
- `wire` checks that every argument is a function, since the type-level
  error objects never exist at runtime.
