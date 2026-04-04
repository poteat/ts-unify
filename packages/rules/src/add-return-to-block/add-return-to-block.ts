import { $ } from "@/capture";
import { U } from "@/ast";

const functionParent = U.or(
  U.FunctionDeclaration(),
  U.FunctionExpression(),
  U.ArrowFunctionExpression(),
);

/**
 * Transform function body blocks with a single expression statement into blocks
 * that return that expression
 *
 * @example
 * ```ts
 * // Before
 * function foo() { someFunction(); }
 *
 * // After
 * function foo() { return someFunction(); }
 * ```
 */
export const addReturnToBlock = U.BlockStatement({
  parent: functionParent,
  body: [U.ExpressionStatement({ expression: $ })],
})
  .to(({ expression: argument }) => U.BlockStatement({ body: [U.ReturnStatement({ argument })] }))
  .message("Add explicit return to single-expression function body");
