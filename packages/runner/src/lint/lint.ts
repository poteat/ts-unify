import { matchWithSites, applyRewrites, commentNodes } from '@ts-unify/engine'

import type { RuleMeta } from '../extract-rule-meta'
import type { AstNode } from './ast-node'
import { isAstNode } from './is-ast-node'
import type { LintMatch } from './lint-match'
import { mergeWiths } from './merge-withs'
import { rootSites } from './root-sites'

/**
 * Run a set of rules over a pre-parsed AST: every match, with its reified
 * output node ready for the consumer to serialize.
 *
 * Rewrites, the root-level `.to()` and any inner `.to()` sites, are applied
 * in a single bottom-up pass via the engine's `applyRewrites`.
 *
 * @param ast the parsed program, with `loc` on its nodes
 * @param rules the rules to run
 */
export function lint(ast: unknown, rules: readonly RuleMeta[]): LintMatch[] {
  const found: LintMatch[] = []

  function check(node: AstNode) {
    for (const { kebab, message, patterns, factory, withs } of rules) {
      for (const { tag, pattern, chain } of patterns) {
        if (node.type !== tag) continue
        const result = matchWithSites(node, pattern, chain)
        if (!result) continue
        mergeWiths(result.bag, withs)
        let reified: unknown = null

        try {
          reified = applyRewrites(
            node,
            rootSites(result, factory),
            result.capturePaths,
          )
        } catch (e) {
          console.warn(`[ts-unify] rewrite failed for ${kebab}:`, e)
          reified = null
        }

        found.push({
          rule: kebab,
          message,
          line: node.loc?.start.line ?? 0,
          column: (node.loc?.start.column ?? 0) + 1,
          endLine: node.loc?.end.line ?? 0,
          endColumn: (node.loc?.end.column ?? 0) + 1,
          reified,
        })
      }
    }
  }

  function walk(node: unknown, parent: unknown) {
    if (typeof node !== 'object' || !node) return

    if (isAstNode(node)) {
      node.parent = parent
      check(node)
      if (node.type === 'Program') for (const c of commentNodes(node)) check(c)
    }

    for (const [key, child] of Object.entries(
      node as Record<string, unknown>,
    )) {
      if (key === 'parent' || key === 'comments' || key === 'tokens') continue

      if (Array.isArray(child)) {
        for (const c of child) walk(c, node)
      } else if (isAstNode(child)) walk(child, node)
    }
  }

  walk(ast, undefined)

  return found
}
