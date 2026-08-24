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

- `body` — the block's statements. The rule finds the first
  single-declarator `const` whose one read is in the very next statement
  and rewrites the block with the declaration gone and that read replaced
  by the initializer.

## Notes

- Every single-declarator `const` of the block is examined, first to
  last; the report lands on the block.
- A read is counted by its role, not its name: a non-computed property
  key or member name, a binding (declarator, parameter, pattern element,
  catch parameter), a label, an import or export specifier and a type
  position are not reads.
- The const is left alone when: a same-named binding is made anywhere
  after it (a parameter `x => x + 1`); a type position names it
  (`typeof x`); it has more than one read, or its one read is not in the
  next statement; the read sits inside a nested function or a loop's
  test, update or body (the initializer would run later, again, or
  never); the read is a shorthand property; the read sits in a template
  literal's hole (a template is built from named fragments); the declarator is annotated
  (`const x: Narrow = v` checks `v`); or the initializer has effects (a
  call, `new`, `await`, `yield`, an assignment, an update, a tagged
  template) and the read comes after another effect in the statement or
  sits under a branch (`&&`/`||`/`??` right side, a conditional, an
  `if` body, an optional chain, a `switch` case, a `try`).
- Only the one read node is replaced; the rest of the statement is kept.
