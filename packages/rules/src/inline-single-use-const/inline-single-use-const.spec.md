# inlineSingleUseConst

## Overview

Inline a `const` binding that is declared and immediately used in the
very next statement, then never referenced again within the block.

## Transforms

```ts
// Before
function report(err: Error) {
  const handler = config.onError;
  handler?.(err);
}

// After
function report(err: Error) {
  config.onError?.(err);
}
```

```ts
// Before
const url = base + "/api";
fetch(url);

// After
fetch(base + "/api");
```

## Captures

- `before` — statements preceding the const declaration.
- `id` — the declared identifier.
- `init` — the initializer expression.
- `stmt` — the single statement that uses the binding.
- `after` — statements following the usage.

## Notes

- The rewrite uses `sub(stmt, id, init)` to substitute every occurrence
  of the identifier in the usage statement with the initializer.
- Safe because: the binding is `const` (no reassignment), the usage is
  the immediately following statement (no intervening code), and the
  substitution is purely structural.
- Does not verify that `id` actually appears in `stmt`. If it doesn't,
  the const is dead code and removing it is still correct.
