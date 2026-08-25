import type { Cursor } from './types'
/**
 * The cursor one step down, under a property key or an array index.
 *
 * @param at the cursor of the enclosing node
 * @param key the property key or array index
 */
export const childCursor = (at: Cursor, key: string | number): Cursor => ({
  ctx: at.ctx,
  path: [...at.path, key],
  key: String(key),
})
