import { U, $ } from "@ts-unify/core";
import { AST_NODE_TYPES } from "@typescript-eslint/types";

const returnBlock = U.BlockStatement({
  body: [U.ReturnStatement({ argument: $ }).defaultUndefined()],
}).seal();

const exprBlock = U.BlockStatement({
  body: [U.ExpressionStatement({ expression: $ })],
}).bind();

const fnBoundary = U.or(U.FunctionDeclaration(), U.FunctionExpression());

/**
 * Convert function declarations and expressions with single-statement bodies to
 * arrow functions. Skips functions that use `this` or `arguments`.
 *
 * @example
 * ```ts
 * // Before
 * function foo(x) {
 *   return x + 1;
 * }
 *
 * // After
 * const foo = (x) => x + 1;
 * ```
 *
 * @example
 * ```ts
 * // Before
 * function(x) { return x + 1; }
 *
 * // After
 * (x) => x + 1
 * ```
 */
export const functionDeclReturnToArrow = U.fromNode({
  type: U.or(AST_NODE_TYPES.FunctionDeclaration, AST_NODE_TYPES.FunctionExpression),
  body: U.or(returnBlock, exprBlock),
  generator: false,
  ...$,
})
  .where(
    U.or(U.ThisExpression(), U.Identifier({ name: "arguments" }))
      .until(fnBoundary)
      .none(),
  )
  .with(({ async, params, body, returnType }) => ({
    init: U.ArrowFunctionExpression({
      async,
      params,
      body,
      returnType,
    }),
  }))
  .to(({ id, init }) =>
    id
      ? U.VariableDeclaration({
          kind: "const",
          declarations: [
            U.VariableDeclarator({
              id,
              init,
            }),
          ],
        })
      : init,
  )
  .message("Convert single-statement function to arrow function");
