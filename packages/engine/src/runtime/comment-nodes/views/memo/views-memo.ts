import type {
  ParsedProgram,
  Views,
} from '@engine/runtime/comment-nodes/views/types'

import Builders from './builders'
/**
 * A memo of the views of each program, built once per program object
 * and held weakly; a value that is no program has empty views.
 */
export function viewsMemo(): { of: (program: unknown) => Views } {
  const memo = new WeakMap<object, Views>()

  return {
    of: program => {
      if (typeof program !== 'object' || !program) {
        return { list: [], byRaw: new WeakMap() }
      }

      const hit = memo.get(program)
      if (hit) return hit
      const built = Builders.buildViews(program as ParsedProgram)
      memo.set(program, built)

      return built
    },
  }
}
