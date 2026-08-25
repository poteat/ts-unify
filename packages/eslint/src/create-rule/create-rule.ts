import {
  matchAdmitted,
  applyRewrites,
  dispatcherOf,
  proxyNodeOf,
} from '@ts-unify/engine'
import KeepsComments from '@ts-unify/eslint/keeps-comments'
import PrintNode from '@ts-unify/eslint/print-node'
import RuleModule from '@ts-unify/eslint/rule-module'
import type { TransformLike } from '@ts-unify/eslint/transform-like'
import { extractRuleMeta, rootSites } from '@ts-unify/runner'
import type { TSESTree } from '@typescript-eslint/types'

import Imports from './imports'
import Meta from './meta'
import type { RuleOptions } from './types'
import Visitors from './visitors'

/**
 * Compile an AstTransform into an ESLint rule module. The rule is fixable
 * when the chain has a top-level `.to()` or a sub-pattern carries one.
 *
 * @param transform the pattern, with or without `.to()`
 * @param opts the parts of `RuleOptions` the caller sets
 */
export function createRule(
  transform: TransformLike,
  opts: Partial<RuleOptions> = {},
): RuleModule.RuleModule {
  const meta = extractRuleMeta('', transform)
  const entries = meta.patterns
  const message = opts.message ?? (meta.message || Meta.DEFAULT_MESSAGE)
  const canFix = opts.canFix !== false
  const factory = canFix ? meta.factory : null
  const withEntries = meta.withs
  const proxyNode = proxyNodeOf(transform)
  const isFixable = factory !== null || Meta.patternContainsInnerTo(entries)
  const importMap = proxyNode ? Imports.resolveImports(proxyNode.chain) : null
  const dispatchers = [...Visitors.groupByTag(entries)].map(
    ([tag, candidates]) => [tag, dispatcherOf(candidates)] as const,
  )

  return {
    meta: Meta.ruleMeta(message, isFixable),
    create(context) {
      const sourceCode = context.sourceCode ?? context.getSourceCode?.()
      let visitors: ReadonlyMap<string, RuleModule.Visitor> = new Map()

      for (const [tag, admitted] of dispatchers) {
        function visit(node: TSESTree.Node) {
          let first: ReturnType<typeof matchAdmitted> = null

          for (const { pattern, chain } of admitted(node)) {
            first = matchAdmitted(node, pattern, chain)

            if (first) break
          }

          if (!first) return

          const result = first
          const bag = result.bag
          const data: Record<string, string> = {}

          for (const [k, v] of Object.entries(bag)) {
            data[k] =
              typeof v === 'object' &&
              v &&
              'type' in v &&
              v.type === 'Identifier' &&
              'name' in v
                ? String(v.name)
                : String(v)
          }

          const sites = canFix ? rootSites(result, factory) : []

          context.report({
            ...(tag === 'Comment'
              ? {
                  loc: node.loc,
                }
              : {
                  node,
                }),

            messageId: 'match',
            data,

            ...(sites.length > 0
              ? {
                  fix(fixer) {
                    if (withEntries.length > 0) {
                      let b: Record<string, unknown> = bag

                      for (const w of withEntries)
                        b = {
                          ...b,
                          ...w(b),
                        }

                      for (const k of Object.keys(b)) bag[k] = b[k]
                    }

                    const text = PrintNode.printNode(
                      applyRewrites(node, sites, result.capturePaths),
                    )

                    if (
                      !KeepsComments.keepsComments(
                        KeepsComments.commentsInside(sourceCode, node),
                        text,
                      )
                    ) {
                      return null
                    }

                    if (importMap) {
                      const fullSource = RuleModule.sourceText(sourceCode)
                      const missingImports: Record<string, string> = {}

                      for (const [specifier, modulePath] of Object.entries(
                        importMap,
                      )) {
                        if (
                          !Imports.hasImport(fullSource, specifier, modulePath)
                        )
                          missingImports[specifier] = modulePath
                      }

                      if (Object.keys(missingImports).length > 0) {
                        return [
                          fixer.insertTextBeforeRange(
                            [0, 0],
                            Imports.buildImportStatements(missingImports),
                          ),
                          fixer.replaceText(node, text),
                        ]
                      }
                    }

                    return fixer.replaceText(node, text)
                  },
                }
              : {}),
          })
        }

        visitors = Visitors.withVisitor(visitors, tag, visit)
      }

      return Object.fromEntries(visitors)
    },
  }
}
