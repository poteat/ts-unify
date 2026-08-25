import Context from '@ts-unify/engine/runtime/match/context'
/**
 * A cursor at the root of a fresh context, for the matches a count makes
 * and discards.
 */
export const countCursor = (): Context.Cursor => ({
  ctx: Context.createMatchContext(),
  path: [],
})
