import type { BuilderMap } from "@/ast";
import { $ } from "@/capture";

declare const U: BuilderMap;

/**
 * Elide braces for arrow functions that return a single expression.
 *
 * Transforms:
 *   (x) => { return x + 1; }
 *
 * Into:
 *   (x) => x + 1
 */
export const elideBracesForReturn = U.BlockStatement({
  parent: U.ArrowFunctionExpression(),
  body: [U.ReturnStatement({ argument: $ }).defaultUndefined()],
}).to();
