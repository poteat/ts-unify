import type { ReportSite } from './report-site'
import type { RuleFix } from './rule-fix'
import type { RuleFixer } from './rule-fixer'

/**
 * What a rule hands `context.report`: a site, a message id, the data its
 * placeholders read, and a fix when the match carries rewrites.
 */
export type ReportDescriptor = ReportSite & {
  messageId: string
  data?: Record<string, string>
  fix?: (fixer: RuleFixer) => RuleFix | RuleFix[] | null
}
