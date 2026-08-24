/**
 * Node keys under which an operand of those kinds must be parenthesized.
 */
export const OPERAND_KEYS: Readonly<Record<string, readonly string[]>> = {
  MemberExpression: ['object'],
  CallExpression: ['callee'],
  NewExpression: ['callee'],
  TaggedTemplateExpression: ['tag'],
  ChainExpression: [],
}
