# Missing

## Overview

`Missing<R>` is the union of every slot some definition in the tuple `R`
reads and no definition in `R` fills; `never` when `R` is complete.

```typescript
type M = Missing<[typeof stamp]> // Atom<Clock> | Atom<Settings>
```

It is what `createStore` checks. `Store.get` walks the requested slot's
deps instead (`MissingBelow`), since a narrowed binding has no tuple to
read.

Membership is by slot type: two slots of one type satisfy each other
here, and the runtime tells them apart by symbol and throws.
