import fs from 'node:fs'
import path from 'node:path'

/**
 * Every `.ts` file under the `src` of each package of a repository, in
 * path order; tests and specs included, `node_modules` and `dist` not.
 *
 * @param root the repository root
 * @returns the file paths, sorted
 */
export function sourceFiles(root: string): string[] {
  const files: string[] = []

  function visit(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== 'dist') visit(full)
      } else if (entry.name.endsWith('.ts')) {
        files.push(full)
      }
    }
  }

  const packages = path.join(root, 'packages')

  for (const pkg of [...fs.readdirSync(packages)].sort()) {
    const src = path.join(packages, pkg, 'src')
    if (fs.existsSync(src)) visit(src)
  }

  return files.sort()
}
