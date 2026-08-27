import type { JsdocTag } from '@ts-unify/core/internal'

/**
 * A JSDoc's lines split up: the summary lines, the body lines, and a tag
 * per `@` line with its name and joined text.
 */
export type JsdocParts = {
  summary: string[]
  body: string[]
  tags: JsdocTag[]
}
