import { U, $ } from '@ts-unify/core'

import { PARENTHESIZED_BODY } from './parenthesized-body'

/**
 * An arrow whose block is one `return` has that expression as its body;
 * an object literal or a sequence there is parenthesized.
 *
 * @example `x => { return x + 1 }` becomes `x => x + 1`
 */
export const elideBracesForReturn = U.BlockStatement({
  parent: U.ArrowFunctionExpression(),
  body: [U.ReturnStatement({ argument: $ }).defaultUndefined()],
})
  .to(bag => {
    const argument = (bag as { argument?: { type?: string } }).argument

    return argument &&
      typeof argument === 'object' &&
      PARENTHESIZED_BODY.has(argument.type ?? '')
      ? { ...argument, extra: { parenthesized: true } }
      : argument
  })
  .message('Elide braces for single-return arrow functions')
  .recommended()
