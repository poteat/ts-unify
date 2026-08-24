import type { RuleModule } from '../rule-module'

/**
 * A rule module's `meta`: a suggestion with one message, `match`, and
 * `fixable: 'code'` only when the rule carries a rewrite.
 *
 * @param message the text of `match`
 * @param isFixable whether the rule's reports carry a fix
 */
export function ruleMeta(
  message: string,
  isFixable: boolean,
): RuleModule['meta'] {
  const messages = { match: message }

  return isFixable
    ? { type: 'suggestion', fixable: 'code', messages }
    : { type: 'suggestion', messages }
}
