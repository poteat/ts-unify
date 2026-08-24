import type { TSESTree } from "@typescript-eslint/types"

/**
 * Whether a replacement carries every comment of the range it replaces.
 *
 * A rewrite prints the new node from the AST, which holds no comments; a
 * directive inside the old range (`@ts-expect-error`, `eslint-disable`)
 * would vanish with the text around it. A fix that loses one is withheld.
 * @param comments the comments inside the replaced range
 * @param text the replacement
 */
export const keepsComments = (
  comments: readonly TSESTree.Comment[],
  text: string,
) => comments.every(c => text.includes(c.value))
