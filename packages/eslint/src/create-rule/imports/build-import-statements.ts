/**
 * One `import { specifier1, specifier2 } from "module";\n` per module
 * path of a resolved imports map, joined.
 *
 * @param imports `{ specifier: modulePath }`
 */
export function buildImportStatements(imports: Record<string, string>) {
  const byModule = new Map<string, readonly string[]>()

  for (const [specifier, modulePath] of Object.entries(imports)) {
    byModule.set(modulePath, [...(byModule.get(modulePath) ?? []), specifier])
  }

  return [...byModule]
    .map(
      ([modulePath, specifiers]) =>
        `import { ${specifiers.join(', ')} } from "${modulePath}";\n`,
    )
    .join('')
}
