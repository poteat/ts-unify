/**
 * A Program holding one line comment, `// a`, before one token; the
 * comment's `loc` is where a `U.Comment` match reports.
 */
export const LINE_COMMENT_PROGRAM = {
  type: 'Program',
  body: [],
  range: [5, 7],
  comments: [
    {
      type: 'Line',
      value: ' a',
      range: [0, 4],
      loc: { start: { line: 1, column: 0 }, end: { line: 1, column: 4 } },
    },
  ],
  tokens: [{ type: 'Identifier', value: 'x', range: [5, 6] }],
} as const
