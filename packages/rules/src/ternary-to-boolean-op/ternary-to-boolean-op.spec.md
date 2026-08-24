# ternaryToBooleanOp

## Overview

A ternary with a boolean literal arm is a boolean operator in more tokens:
`c ? true : r` is `c || r`, `c ? r : false` is `c && r`, `c ? false : r` is
`!c && r`, `c ? true : false` is `c`, `c ? false : true` is `!c`. A negated
equality is written flipped (`a !== b`). Fixed.

## Scope

- Only when the test is boolean by shape: a comparison (`===`, `!==`, `<`,
  `in`, `instanceof`, ...), a `!`, a `&&`/`||` of those, or a boolean
  literal. For any other test the ternary yields `true`/`false` where the
  operator yields the test's own value (`x ? true : r` is `true` for
  `x = 1`; `x || r` is `1`), so it is left alone.
- `c ? r : false` is not rewritten when `r` is itself a literal.

## Examples

```ts
// Before
a === b ? true : c > d
// After
a === b || c > d
```
