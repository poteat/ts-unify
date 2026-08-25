/**
 * A `package.json` as the version scripts read it: the name, the version
 * and the dependency tables.
 *
 * Whatever else it holds is written back as it was.
 */
export type Manifest = {
  name?: string
  version?: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
}
