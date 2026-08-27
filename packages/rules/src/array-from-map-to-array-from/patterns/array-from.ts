import Patterns from '@ts-unify/rules/patterns'

/**
 * The callee `Array.from`, as a pattern to match and as a node to build.
 */
export const arrayFrom = Patterns.staticMember('Array', 'from')
