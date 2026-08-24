/**
 * The node kinds whose evaluation may have an effect: a call, a
 * construction, an await, a yield, a write, a tagged template.
 */
export const EFFECTS: ReadonlySet<string> = new Set([
  'CallExpression',
  'NewExpression',
  'AwaitExpression',
  'YieldExpression',
  'AssignmentExpression',
  'UpdateExpression',
  'TaggedTemplateExpression',
])
