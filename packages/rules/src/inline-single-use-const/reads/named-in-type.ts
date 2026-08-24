import Tree from './tree'

/**
 * Whether a type position names the const (`typeof x`): a reference that
 * cannot take the initializer's place, so the declaration stays.
 *
 * @param tree the nodes searched
 * @param name the name
 */
export const namedInType = (tree: unknown, name: string) =>
  [...Tree.walk(tree)].some(
    ([n, parent]) =>
      Tree.spells(n, name) && parent !== null && parent.type.startsWith('TS'),
  )
