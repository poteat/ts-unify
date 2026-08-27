import Util from './util'

/**
 * Whether a source already holds `import { ..., specifier, ... } from
 * "modulePath"`, with either quote.
 *
 * @param source the file's full text
 * @param specifier the named import
 * @param modulePath the module it comes from
 * @returns true when such an import statement is in the source
 */
export function hasImport(
  source: string,
  specifier: string,
  modulePath: string,
) {
  const names = String.raw`\{[^}]*\b${specifier}\b[^}]*\}`
  const origin = String.raw`from\s+["']${Util.escapeRegExp(modulePath)}["']`

  return new RegExp(String.raw`import\s+${names}\s+${origin}`).test(source)
}
