import type { CAPTURE_MODS_BRAND } from '@/capture/capture-mods'

/**
 * The modifier record a capture token carries under the mods brand; empty
 * for a token with none.
 *
 * @typeParam P capture token read for its modifiers
 */
export type ExtractMods<P> = P extends {
  readonly [CAPTURE_MODS_BRAND]: infer M
}
  ? M
  : {}
