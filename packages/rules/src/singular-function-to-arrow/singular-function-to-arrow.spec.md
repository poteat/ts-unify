# functionDeclReturnToArrow

## Overview

Convert function declarations and expressions with single-statement bodies into arrow functions.

## Transforms

```ts
// Before
function foo(x) {
  return x + 1;
}

// After
const foo = (x) => x + 1;
```

```ts
// Before (anonymous function expression)
function(x) { return x + 1; }

// After
(x) => x + 1
```

## Captures

- `id` -- the function name identifier (if present; determines whether a `const` declaration is emitted).
- `async` -- whether the function is async.
- `params` -- the function parameters.
- `body` -- the single expression extracted from the block body.

## Notes

- This transformation is potentially unsafe because arrow functions do not have their own `this` binding. Code that relies on dynamic `this` (e.g., object methods, event handlers, or functions using `call`/`apply`) may break.
- It also changes hoisting behavior: `const` assignments are not hoisted like function declarations.
