import Scan from '@ts-unify/rules/inline-single-use-const/scan'

/**
 * The first const of a block that one read in the very next statement
 * consumes, with that read; null when there is none.
 *
 * Exported so a wrapper can see which const a report is about. The block
 * is scanned once, whoever asks and however often.
 *
 * @param body the block's statements
 * @returns the first inlinable const with its read, or null when none or the
 *          body is not an array
 */
export const inlinableConst = (body: unknown): Scan.Inlinable | null =>
  Array.isArray(body) ? Scan.analyses.of(body).found : null
