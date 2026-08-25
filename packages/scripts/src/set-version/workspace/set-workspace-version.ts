import * as path from 'path'

import Dirs from './dirs'
import PackageVersion from './package-version'

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

  for (const dir of Dirs.packageDirs()) {
    PackageVersion.setPackageVersion(path.join(dir, 'package.json'), version)
  }

  const rootFile = path.join(Dirs.ROOT, 'package.json')
  PackageVersion.writeManifest(rootFile, {
    ...PackageVersion.readManifest(rootFile),
    version,
  })
  console.log(`root → ${version}`)
}
