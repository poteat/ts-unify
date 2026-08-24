/**
 * A string declared as `string | number`, so the check sees the union and
 * a `typeof` guard narrows it.
 */
export const unionValue: string | number = 'hello'
