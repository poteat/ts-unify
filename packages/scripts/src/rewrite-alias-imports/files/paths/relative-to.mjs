import { dirname, join, relative } from 'node:path'

/**
 * The relative path from a declaration file to an alias target under the
 * build, always starting with a dot.
 *
 * @param dist the build folder the alias is rooted at
 * @param file the declaration file the import sits in
 * @param target the path the alias named
 * @returns the relative specifier
 */
export function relativeTo(dist, file, target) {
  const rel = relative(dirname(file), join(dist, target)).split('\\').join('/')

  return rel.startsWith('.') ? rel : `./${rel}`
}
