# Of

## Overview

`Of<D>` maps an object of slots to the object a read function receives:
the same keys, each slot replaced by its value type, `ValueOf`.

```typescript
type Read = Of<{ clock: Clock; settings: Settings }>
// { readonly clock: { readonly now: number }; readonly settings: ... }
```

Keys are `readonly`; the deps object is written once and never changed.
