import { U, $ } from '@ts-unify/core'

const functionParent = U.or(
  U.FunctionDeclaration(),
  U.FunctionExpression(),
  U.ArrowFunctionExpression(),
)

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
  body: [
    U.ExpressionStatement({ expression: $ }).to(it =>
      U.ReturnStatement({ argument: it.expression }),
    ),
  ],
}).message('Add explicit return to single-expression function body')
