import * as fs from 'fs'

import type { Manifest } from './manifest'

/**
 * Write a `package.json` back to its path, two-space indented with a
 * closing newline, as npm writes it.
 *
 * @param file the `package.json` path
 * @param json the manifest
 */
export const writeManifest = (file: string, json: Manifest) =>
  fs.writeFileSync(file, JSON.stringify(json, null, 2) + '\n')
