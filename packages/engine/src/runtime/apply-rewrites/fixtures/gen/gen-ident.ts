import { DRAWS } from './draws'

/**
 * A random `Identifier` node.
 *
 * @param rand the generator drawn from
 */
export const genIdent = (rand: () => number) => ({
  type: 'Identifier',
  name: DRAWS.names[Math.floor(rand() * DRAWS.names.length)],
})
