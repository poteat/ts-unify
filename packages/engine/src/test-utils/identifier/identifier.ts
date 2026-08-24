/**
 * An ESTree `Identifier` node of the name.
 *
 * @param name the identifier's name
 */
export const identifier = (name: string) => ({ type: 'Identifier', name })
