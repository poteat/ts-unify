import { DRAWS } from './draws'
import { genIdent } from './gen-ident'

/**
 * A random expression node: a `Literal` or an `Identifier`.
 *
 * @param rand the generator drawn from
 * @returns a `Literal` node with a random integer value, or a random
 *          `Identifier`
 */
export function genExpr(rand: () => number) {
  const drawsLiteral = rand() < DRAWS.literalOdds

  return drawsLiteral
    ? {
        type: 'Literal',
        value: Math.floor(rand() * DRAWS.literalRange),
      }
    : genIdent(rand)
}
