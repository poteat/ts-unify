/**
 * The node of a property read off a base.
 *
 * @param base the node the property is read off
 * @param property the property node
 */
export const member = (base: unknown, property: unknown) => ({
  type: 'MemberExpression',
  object: base,
  property,
})
