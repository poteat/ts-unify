# ifGuardedCallToOptional

## Overview

Transform if-guarded function calls into optional chaining calls.

## Transforms

```ts
// Before
if (func) {
  func(arg1, arg2);
}

// After
func?.(arg1, arg2);
```

## Captures

- `callee` -- the function being guarded and called (used as both the `if` test and the call target).
- `args` -- the arguments passed to the function call.
