import type { TSESTree } from '@typescript-eslint/types'

/**
 * Whether a function expression is a method's body: an arrow there would
 * lose the method syntax (`run(x) {}` cannot be `run x => ...`) and `this`.
 *
 * @param parent the node holding the function; none at the top of a file
 * @returns true when the parent is a method definition, or a property that is a
 *          method, getter or setter
 */
export const isMethodBody = (parent: TSESTree.Node | null | undefined) =>
  parent?.type === 'MethodDefinition' ||
  parent?.type === 'TSAbstractMethodDefinition' ||
  (parent?.type === 'Property' &&
    (parent.method || parent.kind === 'get' || parent.kind === 'set'))
