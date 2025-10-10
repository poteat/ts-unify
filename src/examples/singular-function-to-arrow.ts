import type { BuilderMap } from "@/ast";
import { $ } from "@/capture";
import { AST_NODE_TYPES } from "@typescript-eslint/types";

declare const U: BuilderMap;

const returnBlock = U.BlockStatement({
  body: [U.ReturnStatement({ argument: $ }).defaultUndefined()],
}).seal();

const exprBlock = U.BlockStatement({
  body: [U.ExpressionStatement({ expression: $ })],
})
  .map((expression) =>
    U.BlockStatement({
      body: [U.ExpressionStatement({ expression })],
    })
  )
  .seal();

/**
 * Convert function declarations and expressions with single-statement bodies to arrow functions
 *
 * Transforms:
 *   function foo(x) {
 *     return x + 1;
 *   }
 *   →
 *   const foo = (x) => x + 1;
 *
 * Also transforms anonymous function expressions:
 *   function(x) { return x + 1; }
 *   →
 *   (x) => x + 1
 *
 * WARNING: This transformation is potentially unsafe because arrow functions
 * don't have their own `this` binding. Code that relies on dynamic `this`
 * (e.g., object methods, event handlers, or functions using `call`/`apply`)
 * may break after this transformation. It also changes hoisting behavior for
 * function declarations (const assignments are not hoisted like declarations).
 */
export const functionDeclReturnToArrow = U.fromNode({
  type: U.or(
    AST_NODE_TYPES.FunctionDeclaration,
    AST_NODE_TYPES.FunctionExpression
  ),
  id: $,
  params: $,
  async: $,
  body: U.or(returnBlock, exprBlock),
  generator: false,
})
  .with(({ async, params, body }) => ({
    init: U.ArrowFunctionExpression({
      async,
      params,
      body,
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
      : init
  );
