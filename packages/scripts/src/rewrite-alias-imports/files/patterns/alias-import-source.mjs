/**
 * The source of the pattern of one `@/x` import in a declaration file:
 * the lead (`from ` or `import(`), the quote, and the aliased path.
 */
export const ALIAS_IMPORT_SOURCE =
  String.raw`(?<lead>from\s+|import\s*\(\s*)` +
  String.raw`(?<quote>["'])@\/(?<target>[^"']*)\k<quote>`
