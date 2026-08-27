import { declarationsUnder } from '@ts-unify/scripts/files/declarations-under.mjs'
import { readFileSync } from 'node:fs'
import { relative, resolve } from 'node:path'

import { rewriteFile } from './files/rewrite-file.mjs'

/**
 * Rewrites the `@/x` imports of every emitted declaration under a build to
 * relative paths, and exits with 1 when any alias import remains.
 *
 * tsc emits the alias as written, and a consumer has no `@/*` mapping.
 *
 * @param dist the build folder
 */
export function rewriteAliasImports(dist) {
  const files = declarationsUnder(dist)
  const rewritten = files.reduce(
    (count, file) => count + rewriteFile(dist, file),
    0,
  )
  const leftover = files.filter(file =>
    /["']@\//.test(readFileSync(file, 'utf8')),
  )

  if (leftover.length > 0) {
    console.error(`alias imports remain in: ${leftover.join(', ')}`)
    process.exit(1)
  }

  const under = relative(process.cwd(), dist)

  console.log(`rewrote ${rewritten} alias import(s) under ${under}`)
}

rewriteAliasImports(resolve(process.argv[2] ?? 'dist'))
