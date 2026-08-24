import { U, $ } from "@ts-unify/core";

/**
 * Elide braces for arrow functions that return a single expression. An
 * object literal or a sequence is parenthesized as the body.
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
/**
 * Expression kinds an arrow body must wrap in parentheses: an object literal
 * would read as a block, a sequence would end the arrow at its first comma.
 */
const PARENTHESIZED_BODY = new Set(["ObjectExpression", "SequenceExpression"]);

export const elideBracesForReturn = U.BlockStatement({
  parent: U.ArrowFunctionExpression(),
  body: [U.ReturnStatement({ argument: $ }).defaultUndefined()],
})
  .to((bag) => {
    const argument = (bag as { argument?: { type?: string } }).argument;
    return argument !== undefined && typeof argument === "object" && PARENTHESIZED_BODY.has(argument.type ?? "")
      ? { ...argument, extra: { parenthesized: true } }
      : argument;
  })
  .message("Elide braces for single-return arrow functions")
  .recommended();
