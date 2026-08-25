# Missing

## Overview

`Missing<R>` is the union of every slot some definition in the tuple `R`
reads and no definition in `R` fills; `never` when `R` is complete.

```typescript
type M = Missing<[typeof stamp]> // Clock | Settings
```

It is what `createStore` checks. `Store.get` walks the requested slot's
deps instead (`MissingBelow`), since a narrowed binding has no tuple to
read.

Membership is by slot type, which is the `Atom` alias with its name:
`CacheDir` and `RepoRoot`, both over `string`, are two members, and
filling one leaves the other missing. Two unnamed atoms over one value
type are one member here; the runtime tells them apart by symbol and
throws.
