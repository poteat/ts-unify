# Changelog

## Unreleased

- Add `.where()`, `.none()`, `.until()` — declarative subtree constraints
- Fix zero-arg `.bind()` to re-key to parent field (was hardcoded to `"node"`)
- Fix zero-arg `.to()` to return the single capture value (was treated as no-op)
- Skip functions using `this`/`arguments` in `singular-function-to-arrow`
- Add autofix to `elide-braces-for-return`
- Publish `@ts-unify/runner` to manage rule lifecycles
- Add `U.seq()` — match consecutive array elements as a group
- Add `sub()` and `contains()` AST utilities in `@ts-unify/engine`
- Add `inline-single-use-const` rule
- Allow `.to()` at any sub-pattern position; rewrites compose bottom-up

## 0.0.1

- Initial version
