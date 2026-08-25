import { U, $ } from '@ts-unify/core'

/**
 * A `const` declaring one name with an empty array literal.
 */
export const emptyArrayDecl = U.VariableDeclaration({
  kind: 'const',
  declarations: [
    U.VariableDeclarator({
      id: $('arrayId'),
      init: U.ArrayExpression({ elements: [] as const }),
    }),
  ],
})
