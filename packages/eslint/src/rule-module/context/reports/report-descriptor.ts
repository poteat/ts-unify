import type { RuleFix, RuleFixer } from './fixes'
import type { ReportSite } from './sites'

/**
 * What a rule hands `context.report`: a site, a message id, the data its
 * placeholders read, and a fix when the match carries rewrites.
 */
export type ReportDescriptor = ReportSite & {
  messageId: string
  data?: Record<string, string>
  fix?: (fixer: RuleFixer) => RuleFix | RuleFix[] | null
}
