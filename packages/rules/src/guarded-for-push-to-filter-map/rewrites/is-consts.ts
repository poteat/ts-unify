import type { TSESTree } from '@typescript-eslint/types'

/**
 * Whether every statement kept before the push is a `const`: the only
 * statements a map's callback takes over without a change of meaning.
 *
 * @param consts the statements between the guard and the push
 * @returns true when all are `const` declarations, or there are none
 */
export const isConsts = (
  consts: ReadonlyArray<TSESTree.Statement> | undefined,
) =>
  (consts ?? []).every(
    s => s.type === 'VariableDeclaration' && s.kind === 'const',
  )
