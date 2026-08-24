/**
 * The rules package is runtime-only for the playground, so it has no types.
 *
 * The playground inspects rule objects opaquely, through `symGet` and
 * `extractPatterns`.
 */
declare module '@ts-unify/rules'
