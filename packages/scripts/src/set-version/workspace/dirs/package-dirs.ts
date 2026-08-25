import * as fs from 'fs'
import * as path from 'path'

import PackagesDir from './packages-dir'

/**
 * Every workspace package folder: a subfolder of `packages/` holding a
 * `package.json`.
 */
export const packageDirs = (): readonly string[] =>
  fs
    .readdirSync(PackagesDir.PACKAGES_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => path.join(PackagesDir.PACKAGES_DIR, d.name))
    .filter(d => fs.existsSync(path.join(d, 'package.json')))
