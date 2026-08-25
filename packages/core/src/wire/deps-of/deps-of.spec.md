# DepsOf

`DepsOf<P>` is the tuple of provider types `P` declared through its getter
parameter, `[]` when it takes none, and distributes over a union of
providers.

```typescript
type Deps = DepsOf<typeof report> // [typeof clock, typeof settings]
```

It infers the tuple through `Get<infer Deps>`, which works because a
provider annotates its parameter with `Get` itself.
