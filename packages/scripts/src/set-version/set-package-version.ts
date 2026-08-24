import * as fs from 'fs'

import { SCOPE } from './scope'

/**
 * Write a version into one package's `package.json`: its own, and that of
 * every dependency under the workspace scope.
 *
 * @param file the `package.json` path
 * @param version the version to write
 */
export function setPackageVersion(file: string, version: string) {
  const json = JSON.parse(fs.readFileSync(file, 'utf-8'))
  json.version = version

  for (const depType of [
    'dependencies',
    'devDependencies',
    'peerDependencies',
  ] as const) {
    const deps = json[depType] as Record<string, string> | undefined
    if (!deps) continue

    for (const dep of Object.keys(deps)) {
      if (dep.startsWith(SCOPE)) {
        deps[dep] = version
      }
    }
  }

  fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n')
  console.log(`${json.name} → ${version}`)
}
