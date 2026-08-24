import type { TSESTree } from "@typescript-eslint/types";

/**
 * The source ESLint hands a rule. A text `SourceCode` carries `text`; the
 * legacy surface carries `getText()`. `sourceText` reads either.
 */
type SourceCodeLike = { text: string } | { getText(node?: TSESTree.Node): string };

/** A report site: the matched node, or the location of a comment match. */
type ReportSite = { node: TSESTree.Node } | { loc: TSESTree.SourceLocation };

type RuleContext = {
  sourceCode?: SourceCodeLike | object;
  getSourceCode?(): SourceCodeLike;
  report(
    descriptor: ReportSite & {
      messageId: string;
      data?: Record<string, string>;
      fix?: (fixer: RuleFixer) => RuleFix | RuleFix[] | null;
    },
  ): void;
};

type RuleFixer = {
  replaceText(node: TSESTree.Node, text: string): RuleFix;
  insertTextBeforeRange(range: [number, number], text: string): RuleFix;
};

type RuleFix = { range: [number, number]; text: string };

/** The full text behind a context's `sourceCode`, or "" when it carries none. */
export function sourceText(sourceCode: unknown): string {
  if (typeof sourceCode !== "object" || sourceCode === null) return "";
  if ("text" in sourceCode && typeof sourceCode.text === "string") return sourceCode.text;
  if ("getText" in sourceCode && typeof sourceCode.getText === "function") {
    const text: unknown = sourceCode.getText();
    return typeof text === "string" ? text : "";
  }
  return "";
}

/** ESLint rule module produced by createRule. */
export type RuleModule = {
  meta: {
    type: "suggestion";
    fixable?: "code";
    messages: Record<string, string>;
  };
  create: (
    context: RuleContext
  ) => Record<string, (node: TSESTree.Node) => void>;
};
