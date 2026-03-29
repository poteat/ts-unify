import type { BuilderMap } from "@/ast";
import { $ } from "@/capture";

declare const U: BuilderMap;

const functionParent = U.or(
  U.FunctionDeclaration(),
  U.FunctionExpression(),
  U.ArrowFunctionExpression()
);

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
export const addReturnToBlock = U.BlockStatement({
  parent: functionParent,
  body: [U.ExpressionStatement({ expression: $ })],
}).to(({ expression: argument }) =>
  U.BlockStatement({ body: [U.ReturnStatement({ argument })] })
);
