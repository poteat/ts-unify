import { U, $ } from '@ts-unify/core'
import { AST_NODE_TYPES } from '@typescript-eslint/types'
import type { TSESTree } from '@typescript-eslint/types'

import { exprBlock } from './expr-block'
import { fnBoundary } from './fn-boundary'
import { isMethodBody } from './is-method-body'
import { returnBlock } from './return-block'

/**
 * A function declaration or expression whose body is one statement is an
 * arrow; a declaration becomes a `const` of its name.
 *
 * A function that reads `this` or `arguments` stays, and so does a
 * method's body, a class or object method keeping its syntax.
 *
 * @example `function f(x) { return x + 1 }` becomes `const f = x => x + 1`
 */
export const singularFunctionToArrow = U.fromNode({
  type: U.or(
    AST_NODE_TYPES.FunctionDeclaration,
    AST_NODE_TYPES.FunctionExpression,
  ),
  body: U.or(returnBlock, exprBlock),
  generator: false,
  parent: $('parent'),
  ...$,
})
  .when(bag => !isMethodBody((bag as { parent?: TSESTree.Node | null }).parent))
  .where(
    U.or(U.ThisExpression(), U.Identifier({ name: 'arguments' }))
      .until(fnBoundary)
      .none(),
  )
  .with(bag => ({
    init: U.ArrowFunctionExpression({
      async: bag.async,
      params: bag.params,
      body: bag.body,
      returnType: bag.returnType,
      typeParameters: bag.typeParameters,
    }),
  }))
  .to(({ id, init }) =>
    id
      ? U.VariableDeclaration({
          kind: 'const',
          declarations: [
            U.VariableDeclarator({
              id,
              init,
            }),
          ],
        })
      : init,
  )
  .message('Convert single-statement function to arrow function')
