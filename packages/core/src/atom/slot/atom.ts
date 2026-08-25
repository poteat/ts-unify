import type { Keyed } from '@/atom/keyed'

/**
 * A slot: identity by reference, a phantom type, no value of its own. A
 * definition fills it; a store reads a value out of it.
 *
 * `Name` is the slot's identity to the checker: `Atom<string, 'CacheDir'>`
 * is its own type, apart from every other atom over `string`. Both
 * phantoms sit in parameter and return position, so both are invariant.
 *
 * @typeParam Value the type a definition filling the slot reads out
 * @typeParam Name the alias's own name, as a literal
 */
export type Atom<Value, Name extends string = never> = Keyed & {
  readonly shape?: (value: Value) => Value

  readonly name?: (name: Name) => Name
}
