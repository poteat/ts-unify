# Changelog

## Unreleased

- Add `U.Comment` — match comments as nodes: `kind`, `text`, JSDoc `summary`/`body`/`tags`, `attachedTo`, `header`; `U.Program({ comments })` sees the same views
- Accept a `RegExp` in string positions; it tests the string and captures nothing
- Add `U.string` — string predicates for string positions and captured values: `reserved(options?)` (table generated from TypeScript's keyword table), `identifierName()`, `regex(re)`, `not(p)`
- `.when` takes a bag callback on a single-capture node (annotated parameter); the match always passes the bag
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
