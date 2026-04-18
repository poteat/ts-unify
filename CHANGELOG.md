# Changelog

## Unreleased

- Add `.where()`, `.none()`, `.until()` — declarative subtree constraints
- Fix zero-arg `.bind()` to re-key to parent field (was hardcoded to `"node"`)
- Fix zero-arg `.to()` to return the single capture value (was treated as no-op)
- Skip functions using `this`/`arguments` in `singular-function-to-arrow`
- Add autofix to `elide-braces-for-return` for single-return arrow bodies
- Publish `@ts-unify/runner` — shared lint/fix logic, used by the playground
- Add `U.seq()` — match contiguous array elements; optional `.to()` rewrite
- Add `sub()` (structural substitution) and `contains()` to `@ts-unify/engine`
- Add `inline-single-use-const` rule — inline a const into the next statement
- Allow `.to()` at any sub-pattern position; rewrites compose bottom-up

## 0.0.1

- Initial version
