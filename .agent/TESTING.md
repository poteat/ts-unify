# Testing Guidelines

This project uses Jest (via `ts-jest`) for both runtime and compile-time (type
level) testing.

## How to run

- `npm test` runs all test suites under `src/**/**.test.ts`.

## Test Types

- Runtime tests: standard Jest assertions against values and behavior.
- Type-level tests: compile-time checks that verify exact type equality.

### Type-level helpers

Located under `src/test-utils/`:

- `assertType<T, U>(0)`: Fails to compile unless `T` and `U` are exactly equal.
  - Use this to ensure types match precisely, including literal vs base types.
- `expectType(value).toBe(expected)`: Runtime equality plus a compile-time check
  that `typeof value` equals the type of `expected`.

Examples:

```ts
import { assertType, expectType } from "./src/test-utils";

// Compile-time: exact type equality
type Actual = { id: 1 } & { name: "a" };
type Expected = { id: 1; name: "a" };
assertType<Actual, Expected>(0);

// Runtime + type check
const value = "hello" as const;
expectType(value).toBe("hello");
```

### Guidelines for type tests

- Keep assertions small and focused; prefer multiple small checks over one large
  complex equality.
- Be conservative with arrays/tuples; exact element ordering and inference can
  be brittle. Consider testing representative slices or using helper types to
  normalize complex intersections.
- Co-locate type tests next to their concept (e.g., `x.test.ts` under the same
  folder as `x.ts`).

## Structure & Naming

- Colocate tests with their subject; name them `*.test.ts`.
- Prefer a 1:1 mapping between a concept file and its test file.
- Specs (`*.spec.md`) should mirror the behavior in tests.

### Describe blocks

- Use exactly one top-level `describe` per test file to keep output and
  structure predictable.
- If you need additional grouping for a concept, create more test files for the
  same subject (e.g., `x.runtime.test.ts`, `x.types.test.ts`) rather than
  nesting multiple `describe` blocks in a single file.
