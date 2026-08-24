import * as fs from 'fs'
import * as path from 'path'

import { packageDirs } from './package-dirs'
import { ROOT } from './root'
import { setPackageVersion } from './set-package-version'

/**
 * Write a version into every workspace package and the root `package.json`;
 * without a version, print the usage and exit 1.
 *
 * @param version the version from the command line
 */
export function setWorkspaceVersion(version: string) {
  if (!version) {
    console.error('Usage: npm run set-version -- <version>')
    process.exit(1)
  }

  for (const dir of packageDirs()) {
    setPackageVersion(path.join(dir, 'package.json'), version)
  }

  const rootFile = path.join(ROOT, 'package.json')
  const rootJson = JSON.parse(fs.readFileSync(rootFile, 'utf-8'))
  rootJson.version = version
  fs.writeFileSync(rootFile, JSON.stringify(rootJson, null, 2) + '\n')
  console.log(`root → ${version}`)
}
