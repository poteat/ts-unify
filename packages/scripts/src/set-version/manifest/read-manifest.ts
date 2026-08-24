import * as fs from 'fs'

import type { Manifest } from './manifest'

/**
 * The parsed `package.json` at a path.
 *
 * @param file the `package.json` path
 */
export const readManifest = (file: string): Manifest =>
  JSON.parse(fs.readFileSync(file, 'utf-8')) as Manifest
