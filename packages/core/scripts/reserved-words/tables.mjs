/**
 * The three tables, each named for the `SyntaxKind` range it is sliced
 * from; see string-predicate.spec.md.
 */
export const TABLES = Object.freeze([
  {
    file: 'reserved-words.ts',
    name: 'RESERVED_WORDS',
    range: 'ReservedWord',
    summary: "TypeScript's ReservedWord range: never an identifier.",
  },
  {
    file: 'strict-mode-reserved-words.ts',
    name: 'STRICT_MODE_RESERVED_WORDS',
    range: 'FutureReservedWord',
    summary:
      "TypeScript's FutureReservedWord range: reserved in strict mode code.",
  },
  {
    file: 'contextual-keywords.ts',
    name: 'CONTEXTUAL_KEYWORDS',
    range: 'ContextualKeyword',
    summary:
      "TypeScript's ContextualKeyword range: keywords that remain legal" +
      ' identifiers.',
  },
])
