import * as path from 'path'

import Manifest from './manifest'
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
  Manifest.writeManifest(rootFile, {
    ...Manifest.readManifest(rootFile),
    version,
  })
  console.log(`root → ${version}`)
}
