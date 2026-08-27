import type { DiffRow } from './types'

/**
 * The class of a diff line by its kind: a kept line carries the base
 * class alone.
 */
export const DIFF_LINE_CLASS: Readonly<Record<DiffRow['kind'], string>> = {
  ctx: 'diff-line',
  del: 'diff-line del',
  add: 'diff-line add',
}
