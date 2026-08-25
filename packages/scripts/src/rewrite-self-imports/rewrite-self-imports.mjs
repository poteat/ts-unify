import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'

/**
 * Rewrite a package's imports of itself by name, in its emitted
 * declarations, to relative paths.
 *
 * A package's tsconfig maps `@ts-unify/<name>/*` to `./src/*`; tsc emits
 * the specifier as written, and a consumer has no such mapping. The
 * declarations mirror `src`, so `<name>/x` is a file beside them.
 *
 * @param dist the declarations folder
 */
export function rewriteSelfImports(dist) {
  const self = JSON.parse(readFileSync('package.json', 'utf8')).name

  const walk = dir =>
    readdirSync(dir).flatMap(name => {
      const p = join(dir, name)

      return statSync(p).isDirectory()
        ? walk(p)
        : p.endsWith('.d.ts')
          ? [p]
          : []
    })

  function relativeTo(file, target) {
    const rel = relative(dirname(file), join(dist, target))
      .split('\\')
      .join('/')

    return rel.startsWith('.') ? rel : `./${rel}`
  }

  const rewritten = walk(dist).reduce((count, file) => {
    const before = readFileSync(file, 'utf8')
    const after = before.replace(
      new RegExp(
        `(?<=from\\s+|import\\s*\\(\\s*)(["'])${self}/([^"']*)\\1`,
        'g',
      ),
      (_, quote, target) => `${quote}${relativeTo(file, target)}${quote}`,
    )
    if (after === before) return count
    writeFileSync(file, after)

    return count + 1
  }, 0)

  if (walk(dist).some(f => readFileSync(f, 'utf8').includes(`'${self}/`))) {
    console.error(`imports of ${self} by name remain under dist`)
    process.exit(1)
  }

  console.log(
    `rewrote ${rewritten} file(s) under ${relative(process.cwd(), dist)}`,
  )
}

rewriteSelfImports(resolve(process.argv[2] ?? 'dist'))
