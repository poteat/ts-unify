/**
 * Which keyword sets {@link reserved} consults; see string-predicate.spec.md.
 */
export type ReservedOptions = {
  /**
   * Count the strict-mode reserved words (`let`, `yield`, `static`...) and
   * `await`.
   */
  readonly isStrict: boolean

  /**
   * Count TypeScript's contextual keywords (`type`, `interface`, `of`...).
   */
  readonly isTypeScript: boolean
}
