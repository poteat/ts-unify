/**
 * The node of a property read off a base.
 *
 * @param base the node the property is read off
 * @param property the property node
 * @returns a `MemberExpression` node of the base and property
 */
export const member = (base: unknown, property: unknown) => ({
  type: 'MemberExpression',
  object: base,
  property,
})
