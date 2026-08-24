/**
 * An `Identifier` node.
 *
 * @param name the identifier's name
 */
export const ident = (name: string) => ({ type: 'Identifier', name })
