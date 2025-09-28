/**
 * Transform function body blocks with a single expression statement into blocks
 * that return that expression
 *
 * Transforms:
 *   function foo() { someFunction(); }
 *
 * Into:
 *   function foo() { return someFunction(); }
 */
import type { BuilderMap } from "@/ast";
import { $ } from "@/capture";

declare const U: BuilderMap;

// Match a block with a single expression statement and capture the expression.
const singleExprBlock = U.BlockStatement({
  body: [U.ExpressionStatement({ expression: $ })],
}).seal();

/** FunctionDeclaration: add return to single-expression body block. */
export const addReturnToBlock_FunctionDeclaration = U.FunctionDeclaration({
  ...$,
  body: singleExprBlock,
}).to((bag) =>
  U.FunctionDeclaration({
    ...bag,
    body: U.BlockStatement({
      body: [U.ReturnStatement({ argument: bag.body })],
    }),
  })
);

/** FunctionExpression: add return to single-expression body block. */
export const addReturnToBlock_FunctionExpression = U.FunctionExpression({
  ...$,
  body: singleExprBlock,
}).to((bag) =>
  U.FunctionExpression({
    ...bag,
    body: U.BlockStatement({
      body: [U.ReturnStatement({ argument: bag.body })],
    }),
  })
);

/** ArrowFunctionExpression: add return to single-expression body block. */
export const addReturnToBlock_ArrowFunctionExpression =
  U.ArrowFunctionExpression({
    ...$,
    body: singleExprBlock,
  }).to((bag) =>
    U.ArrowFunctionExpression({
      ...bag,
      body: U.BlockStatement({
        body: [U.ReturnStatement({ argument: bag.body })],
      }),
    })
  );
