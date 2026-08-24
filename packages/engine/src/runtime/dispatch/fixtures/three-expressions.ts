import { U } from '@ts-unify/core/internal'

/**
 * A root `U.or` of three entries two tags share: two logical
 * expressions told apart by their operator, and a `typeof` comparison.
 */
export const THREE_EXPRESSIONS = U.or(
  U.LogicalExpression({ operator: '&&', right: U.MemberExpression() }),
  U.LogicalExpression({ operator: '||', left: U.Identifier() }),
  U.BinaryExpression({
    operator: U.or('==', '==='),
    left: U.UnaryExpression({ operator: 'typeof' }),
  }),
)
