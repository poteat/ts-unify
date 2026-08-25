import Manifest from './manifest'
import Scope from './scope'

/**
 * Write a version into one package's `package.json`: its own, and that of
 * every dependency under the workspace scope.
 *
 * @param file the `package.json` path
 * @param version the version to write
 */
export function setPackageVersion(file: string, version: string) {
  const json = Manifest.readManifest(file)
  json.version = version

  for (const depType of [
    'dependencies',
    'devDependencies',
    'peerDependencies',
  ] as const) {
    const deps = json[depType]
    if (!deps) continue

    for (const dep of Object.keys(deps)) {
      if (dep.startsWith(Scope.SCOPE)) {
        deps[dep] = version
      }
    }
  }

  Manifest.writeManifest(file, json)
  console.log(`${json.name} → ${version}`)
}
