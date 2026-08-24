import { DRAWS } from './draws'
import { genIdent } from './gen-ident'

/**
 * A random expression node: a `Literal` or an `Identifier`.
 *
 * @param rand the generator drawn from
 */
export const genExpr = (rand: () => number) =>
  rand() < DRAWS.literalOdds
    ? {
        type: 'Literal',
        value: Math.floor(rand() * DRAWS.literalRange),
      }
    : genIdent(rand)
