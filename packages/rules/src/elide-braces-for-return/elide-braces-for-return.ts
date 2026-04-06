import { U, $ } from "@ts-unify/core";

/**
 * Elide braces for arrow functions that return a single expression.
 *
 * @example
 * ```ts
 * // Before
 * (x) => { return x + 1; }
 *
 * // After
 * (x) => x + 1
 * ```
 */
export const elideBracesForReturn = U.BlockStatement({
  parent: U.ArrowFunctionExpression(),
  body: [U.ReturnStatement({ argument: $ }).defaultUndefined()],
})
  .to()
  .message("Elide braces for single-return arrow functions")
  .recommended();
