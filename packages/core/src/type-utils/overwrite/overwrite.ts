/**
 * Overwrite<Left, Right>
 *
 * Produces a new object type by replacing properties in `Left` with those from
 * `Right` when keys collide, and adding any new keys from `Right`.
 *
 * - Equivalent to `Omit<Left, keyof Right> & Right`.
 * - Preserves property optionality and readonly modifiers from `Right` on
 *   overwritten keys.
 *
 * Commonly used to merge capture bags or refine mapped types.
 */
export type Overwrite<Left, Right> = Omit<Left, keyof Right> & Right;
