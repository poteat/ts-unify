# Changelog

## Unreleased

- Add `.where()`, `.none()`, `.until()` — declarative subtree constraints
- Fix zero-arg `.bind()` to re-key to parent field (was hardcoded to `"node"`)
- Fix zero-arg `.to()` to return the single capture value (was treated as no-op)
- `singular-function-to-arrow` now skips functions using `this`/`arguments`
- `elide-braces-for-return` now autofixes
- Publish `@ts-unify/runner` to manage rule lifecycles
- Add `U.seq()` — match consecutive array elements as a group with a scoped `.to()` rewrite
- Add `sub()` and `contains()` AST utilities in `@ts-unify/engine`
- Add `inline-single-use-const` rule

## 0.0.1

- Initial version
