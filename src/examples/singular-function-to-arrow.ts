import type { BuilderMap } from "@/ast";
import { $ } from "@/capture";

declare const U: BuilderMap;

const returnBlock = U.BlockStatement({
  body: [U.ReturnStatement({ argument: $ }).defaultUndefined()],
}).seal();

const exprBlock = U.BlockStatement({
  body: [U.ExpressionStatement({ expression: $ })],
});

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

// ——— Named FunctionDeclaration with a single `return` → const name = (...params) => expr
export const functionDeclReturnToArrow = U.FunctionDeclaration({
  id: $.truthy(),
  params: $,
  async: $,
  body: returnBlock,
  generator: false,
}).to(({ id, params, async, body }) =>
  U.VariableDeclaration({
    kind: "const",
    declarations: [
      U.VariableDeclarator({
        id,
        init: U.ArrowFunctionExpression({ async, params, body }),
      }),
    ],
  })
);

// ——— Named FunctionDeclaration with a single expression statement → const name = (...params) => { expr; }
export const functionDeclExprToArrow = U.FunctionDeclaration({
  id: $.truthy(),
  params: $,
  async: $,
  body: exprBlock,
  generator: false as const,
}).to(({ id, params, async, expression }) =>
  U.VariableDeclaration({
    kind: "const",
    declarations: [
      U.VariableDeclarator({
        id,
        init: U.ArrowFunctionExpression({
          async,
          params,
          body: U.BlockStatement({
            body: [U.ExpressionStatement({ expression })],
          }),
        }),
      }),
    ],
  })
);

// ——— FunctionExpression with a single `return` → (...params) => expr
export const functionExprReturnToArrow = U.FunctionExpression({
  id: null,
  params: $,
  async: $,
  body: returnBlock,
  generator: false,
}).to(({ params, async, body }) =>
  U.ArrowFunctionExpression({ async, params, body })
);

// ——— FunctionExpression with a single expression statement → (...params) => { expr; }
export const functionExprExprToArrow = U.FunctionExpression({
  id: null,
  params: $,
  async: $("async"),
  body: exprBlock,
  generator: false,
}).to(({ params, async, expression }) =>
  U.ArrowFunctionExpression({
    async,
    params,
    body: U.BlockStatement({ body: [U.ExpressionStatement({ expression })] }),
  })
);
