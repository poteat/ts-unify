import type { CAPTURE_MODS_BRAND } from './capture-mods-brand'

/**
 * Attach a set of modifiers to a capture token.
 *
 * @typeParam Mods record of the modifiers, one of the `Mod*` shapes
 */
export type CaptureMods<Mods> = {
  readonly [CAPTURE_MODS_BRAND]: Mods
}
