import { U, $ } from '@ts-unify/core'

/**
 * A `const` declaring one name with an empty array literal, the name
 * captured so an annotated `const out: T[] = []` unifies with the push.
 */
export const emptyArrayDecl = U.VariableDeclaration({
  kind: 'const',
  declarations: [
    U.VariableDeclarator({
      id: U.Identifier({ name: $('arrayName') }),
      init: U.ArrayExpression({ elements: [] as const }),
    }),
  ],
})
