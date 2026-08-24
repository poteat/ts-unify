import { genExpr } from './gen-expr'

/**
 * A random `BlockStatement` of expression statements.
 *
 * @param rand the generator drawn from
 * @param n how many statements the block holds
 */
export const genBlock = (rand: () => number, n: number) => ({
  type: 'BlockStatement',

  body: Array.from(
    {
      length: n,
    },
    () => ({
      type: 'ExpressionStatement',
      expression: genExpr(rand),
    }),
  ),
})
