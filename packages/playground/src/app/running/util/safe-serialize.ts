import TsGenerate from '@ts-unify/playground/app/ts-generate'

/**
 * A reified node as source text, or null when the generator cannot print
 * it.
 *
 * The failure is logged under the rule's name; the match still lists.
 *
 * @param node the reified node
 * @param rule the rule that reified it
 * @returns the text, or null
 */
export function safeSerialize(node: unknown, rule: string): string | null {
  try {
    return TsGenerate.tsGenerate(node)
  } catch (failure) {
    console.warn(`[ts-unify] serialize failed for ${rule}:`, failure)

    return null
  }
}
