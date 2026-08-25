import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'

/**
 * Rewrites the `@engine/x` imports in the emitted declarations to relative
 * paths, since a consumer has no `@engine/*` mapping.
 *
 * tsc emits the alias as written. Exits 1 when an alias import is left.
 *
 * @param dist the declarations folder
 */
export function rewriteAliasImports(dist) {
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

  const count = { rewritten: 0 }

  for (const file of walk(dist)) {
    const before = readFileSync(file, 'utf8')
    const after = before.replace(
      /(from\s+|import\s*\(\s*)(["'])@engine\/([^"']*)\2/g,
      (...m) => {
        const [, lead, quote, target] = m
        count.rewritten += 1

        return `${lead}${quote}${relativeTo(file, target)}${quote}`
      },
    )
    if (after !== before) writeFileSync(file, after)
  }

  const leftover = walk(dist).filter(f =>
    /["']@engine\//.test(readFileSync(f, 'utf8')),
  )

  if (leftover.length) {
    console.error(`alias imports remain in: ${leftover.join(', ')}`)
    process.exit(1)
  }

  console.log(
    `rewrote ${count.rewritten} alias import(s) under ` +
      `${relative(process.cwd(), dist)}`,
  )
}

rewriteAliasImports(resolve(process.argv[2] ?? 'dist'))
