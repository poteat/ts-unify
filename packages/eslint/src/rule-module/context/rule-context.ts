import type { ReportDescriptor } from './report-descriptor'

/**
 * The part of ESLint's rule context a rule here reads: the source, by
 * either spelling, and `report`.
 *
 * A source is read by duck typing (`sourceText`, `commentsInside`): a text
 * `SourceCode` carries `text`, the older surface `getText()`.
 */
export type RuleContext = {
  sourceCode?: object

  /**
   * The older spelling of `sourceCode`.
   */
  readonly getSourceCode?: () => object

  /**
   * Files a report with ESLint.
   *
   * @param descriptor where, which message, its data and a fix
   */
  readonly report: (descriptor: ReportDescriptor) => void
}
