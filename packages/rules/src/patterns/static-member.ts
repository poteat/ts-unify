import { U } from '@ts-unify/core'

/**
 * `Array.from` by the object's and the member's names: a pattern to
 * match and a node to build.
 *
 * @param holder the object's name
 * @param member the member's name
 * @returns the pattern
 */
export const staticMember = (holder: string, member: string) =>
  U.MemberExpression({
    object: U.Identifier({ name: holder }),
    property: U.Identifier({ name: member }),
    computed: false,
    optional: false,
  })
