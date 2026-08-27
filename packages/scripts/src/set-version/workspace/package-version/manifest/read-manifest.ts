import * as fs from 'fs'

import type { Manifest } from './types'

/**
 * The parsed `package.json` at a path.
 *
 * @param file the `package.json` path
 * @returns the manifest as parsed JSON
 */
export const readManifest = (file: string): Manifest =>
  JSON.parse(fs.readFileSync(file, 'utf-8')) as Manifest
