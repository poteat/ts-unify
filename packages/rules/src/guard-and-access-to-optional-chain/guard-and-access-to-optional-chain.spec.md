# guardAndAccessToOptionalChain

## Overview

Replace guard-and-access patterns (`obj && obj.prop`) with optional chaining (`obj?.prop`).

## Transforms

```ts
// Before
obj && obj.prop

// After
obj?.prop
```

## Captures

- `obj` -- the object being guarded and accessed (must match in both sides of `&&`).
- `prop` -- the property being accessed on the object.
