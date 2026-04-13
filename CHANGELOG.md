# Changelog

## Unreleased

- Add `.where()`, `.none()`, `.until()` — declarative subtree constraints
- Fix zero-arg `.bind()` to re-key to parent field (was hardcoded to `"node"`)
- Fix zero-arg `.to()` to return the single capture value (was treated as no-op)
- `singular-function-to-arrow` now skips functions using `this`/`arguments`
- `elide-braces-for-return` now autofixes

## 0.0.1

- Initial version
