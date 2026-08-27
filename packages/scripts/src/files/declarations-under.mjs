import { readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Every `.d.ts` file under a folder, at any depth.
 *
 * @param dir the folder
 * @returns the files' paths
 */
export const declarationsUnder = dir =>
  readdirSync(dir).flatMap(name => {
    const p = join(dir, name)

    return statSync(p).isDirectory()
      ? declarationsUnder(p)
      : p.endsWith('.d.ts')
        ? [p]
        : []
  })
