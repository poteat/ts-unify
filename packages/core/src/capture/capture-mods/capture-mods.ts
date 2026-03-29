// Branding key for deferred capture-local modifiers.
export const CAPTURE_MODS_BRAND = Symbol("CAPTURE_MODS_BRAND");

/** Attach a set of modifiers to a capture token. */
export type CaptureMods<Mods> = {
  readonly [CAPTURE_MODS_BRAND]: Mods;
};

/** Modifier shapes */
export type ModMap<New> = { map: New };
export type ModDefault<Expr> = { default: Expr };
export type ModTruthy = { truthy: true };
export type ModWhen<Narrow> = { when: Narrow };

