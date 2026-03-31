import type { TSESTree } from "@typescript-eslint/types";

type RuleContext = {
  sourceCode?: { getText(node: TSESTree.Node): string };
  getSourceCode?(): { getText(node: TSESTree.Node): string };
  report(descriptor: {
    node: TSESTree.Node;
    messageId: string;
    data?: Record<string, string>;
    fix?: (fixer: RuleFixer) => RuleFix;
  }): void;
};

type RuleFixer = {
  replaceText(node: TSESTree.Node, text: string): RuleFix;
};

type RuleFix = { range: [number, number]; text: string };

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
