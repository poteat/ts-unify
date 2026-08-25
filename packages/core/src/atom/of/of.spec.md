# Of

## Overview

`Of<D>` maps an object of slots to the object a read function receives:
the same keys, each `Atom<T>` replaced by `T`.

```typescript
type Read = Of<{ clock: Atom<Clock>; settings: Atom<Settings> }>
// { readonly clock: Clock; readonly settings: Settings }
```

Keys are `readonly`; the deps object is written once and never changed.
