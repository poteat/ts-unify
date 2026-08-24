/**
 * An object type with the properties of `Left` that `Right` also names
 * replaced by `Right`'s, plus the keys only `Right` has.
 *
 * Equivalent to `Omit<Left, keyof Right> & Right`: an overwritten key keeps
 * the optionality and readonly of `Right`. Used to merge capture bags and to
 * refine mapped types.
 */
export type Overwrite<Left, Right> = Omit<Left, keyof Right> & Right
