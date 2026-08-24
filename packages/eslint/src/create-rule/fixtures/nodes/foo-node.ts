/**
 * The node of `foo` in `import { uniq } from "lodash";\nconst x = foo;`.
 */
export const FOO_NODE = {
  type: 'Identifier',
  name: 'foo',
  range: [30, 33],
} as const
