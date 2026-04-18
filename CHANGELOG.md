# Changelog

## Unreleased

- Add `.where(...)` subtree constraints with `.none()`, `.some()`, `.atLeast(N)`, `.atMost(N)`, `.exactly(N)` quantifiers and `.until()` scoping
- Allow `.to()` at any sub-pattern position; rewrites compose bottom-up
- Add `U.seq()` — match consecutive array elements as a group
- Add `sub()` and `contains()` AST utilities in `@ts-unify/engine`
- Add `inline-single-use-const` rule
- `singular-function-to-arrow` skips functions using `this` / `arguments`
- `elide-braces-for-return` now autofixes
- Fix zero-arg `.bind()` to re-key to the parent field (was hardcoded to `"node"`)
- Fix zero-arg `.to()` to return the single capture value (was a no-op)
- Add `@ts-unify/runner` — engine-agnostic rule lifecycle, shared by the playground and ESLint plugin

## 0.0.1

- Initial version
