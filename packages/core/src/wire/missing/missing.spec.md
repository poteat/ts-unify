# Missing

`Missing<R>` is the union of every provider type that some member of the
tuple `R` declares and that `R` does not hold; `never` when `R` is
complete.

```typescript
type M = Missing<[typeof report]> // typeof clock | typeof settings
```

It is what `wire` checks; `Container.get` walks the dependency graph
instead, since a narrowed binding has no tuple to read.

Membership is structural. Two providers of the same shape satisfy each
other here, so a tuple holding one can declare the other and still be
complete; the runtime tells them apart by reference and throws.
