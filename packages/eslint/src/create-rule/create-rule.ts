import { matchWithSites, applyRewrites, proxyNodeOf } from '@ts-unify/engine'
import { extractRuleMeta, rootSites } from '@ts-unify/runner'
import type { TSESTree } from '@typescript-eslint/types'

import KeepsComments from '../keeps-comments'
import PrintNode from '../print-node'
import RuleModule from '../rule-module'
import type { TransformLike } from '../transform-like'
import { DEFAULT_MESSAGE } from './default-message'
import Imports from './imports'
import { patternContainsInnerTo } from './pattern-contains-inner-to'
import { ruleMeta } from './rule-meta'
import type { RuleOptions } from './rule-options'
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
  const message = opts.message ?? (meta.message || DEFAULT_MESSAGE)
  const canFix = opts.canFix !== false
  const factory = canFix ? meta.factory : null
  const withEntries = meta.withs
  const proxyNode = proxyNodeOf(transform)
  const isFixable = factory !== null || patternContainsInnerTo(entries)
  const importMap = proxyNode ? Imports.resolveImports(proxyNode.chain) : null

  return {
    meta: ruleMeta(message, isFixable),
    create(context) {
      const sourceCode = context.sourceCode ?? context.getSourceCode?.()
      let visitors: ReadonlyMap<string, RuleModule.Visitor> = new Map()

      for (const [tag, candidates] of Visitors.groupByTag(entries)) {
        function visit(node: TSESTree.Node) {
          let first: ReturnType<typeof matchWithSites> = null

          for (const { pattern, chain } of candidates) {
            first = matchWithSites(node, pattern, chain)

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
