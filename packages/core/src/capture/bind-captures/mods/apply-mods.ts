import type { Falsy, Truthy } from '@/ast/builder-helpers'

/**
 * The value type a capture binds to once its modifiers are applied.
 *
 * Applied in order: a default drops the falsy constituents and adds the
 * fallback's type; a map replaces the type; a when guard narrows it; a
 * truthy modifier drops the falsy constituents last.
 *
 * @typeParam Base value type read from the shape
 * @typeParam Mods modifier record of the capture
 */
export type ApplyMods<Base, Mods> = Mods extends infer M
  ? (
      M extends { default: infer D }
        ? Exclude<Base, Falsy> | D
        : M extends { map: infer New }
          ? New
          : Base
    ) extends infer Mapped
    ? (M extends { when: infer Narrow } ? Narrow : Mapped) extends infer Guarded
      ? M extends { isTruthy: true }
        ? Truthy<Guarded>
        : Guarded
      : never
    : never
  : Base
