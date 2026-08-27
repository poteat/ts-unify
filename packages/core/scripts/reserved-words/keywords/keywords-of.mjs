import ts from 'typescript'

/**
 * One `SyntaxKind` range's keywords, sorted, from the installed
 * TypeScript's keyword table.
 *
 * @param range the range's name, as in `SyntaxKind.First<range>`
 * @param api the TypeScript module; the installed one by default
 * @returns the keywords
 */
export const keywordsOf = (range, api = ts) =>
  [
    ...Object.entries(api.textToKeywordObj)
      .filter(
        ([, kind]) =>
          kind >= api.SyntaxKind[`First${range}`] &&
          kind <= api.SyntaxKind[`Last${range}`],
      )
      .map(([text]) => text),
  ].sort()
