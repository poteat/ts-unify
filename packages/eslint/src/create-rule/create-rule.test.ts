import { U, $, C } from '@ts-unify/core'
import type { TSESTree } from '@typescript-eslint/types'
import { parse } from '@typescript-eslint/typescript-estree'
import { Linter } from 'eslint'

import { createRule } from './create-rule'
import Fixtures from './fixtures'

const asNode = (v: object) => v as TSESTree.Node

describe('create-rule', () => {
  type Rule = ReturnType<typeof createRule>
  type Descriptor = Parameters<Parameters<Rule['create']>[0]['report']>[0]
  type Fix = ReturnType<NonNullable<Descriptor['fix']>>
  type Report = {
    line: number
    column: number
    endLine?: number
    endColumn?: number
    message: string
  }

  const id = U.Identifier({ name: $('n') })
  const ifStmt = U.IfStatement({ test: $('cond') })

  const fakeFixer: Parameters<NonNullable<Descriptor['fix']>>[0] = {
    replaceText: (node, text) => ({ range: node.range, text }),
    insertTextBeforeRange: (range, text) => ({ range, text }),
  }

  /**
   * The rule's visitors over a context that collects what it reports and
   * applies each fix with `fakeFixer`.
   */
  function lintWith(rule: Rule, sourceCode?: object) {
    const reported: Descriptor[] = []
    const fixes: Fix[] = []
    const visitors = rule.create({
      sourceCode,
      report(descriptor) {
        reported.push(descriptor)

        if (descriptor.fix) fixes.push(descriptor.fix(fakeFixer))
      },
    })

    return { visitors, reported, fixes }
  }

  const parser = {
    parse: (text: string) =>
      parse(text, { comment: true, tokens: true, loc: true, range: true }),
  }

  /**
   * ESLint's reports on a file, under one rule.
   */
  const lint = (rule: unknown, code: string): Report[] =>
    new Linter()
      .verify(
        code,
        {
          files: ['**/*.ts'],
          languageOptions: { parser },
          plugins: { t: { rules: { r: createRule(rule as never) as never } } },
          rules: { 't/r': 'error' },
          linterOptions: { reportUnusedDisableDirectives: 'off' },
        },
        'a.ts',
      )
      .map(({ line, column, endLine, endColumn, message }) => ({
        line,
        column,
        endLine,
        endColumn,
        message,
      }))

  function valid(rule: unknown, codes: readonly string[]) {
    for (const code of codes)
      expect({ code, reports: lint(rule, code) }).toEqual({ code, reports: [] })
  }

  function invalid(rule: unknown, codes: readonly string[]) {
    for (const code of codes)
      expect({ code, n: lint(rule, code).length }).toEqual({ code, n: 1 })
  }

  it("returns a RuleModule with meta.type = 'suggestion'", () => {
    expect(createRule(id).meta.type).toBe('suggestion')
  })

  it('uses the default message when none is provided', () => {
    expect(createRule(id).meta.messages.match).toBe(
      'Matches a ts-unify pattern',
    )
  })

  it('uses a custom message when provided', () => {
    expect(
      createRule(id, { message: 'Custom message' }).meta.messages.match,
    ).toBe('Custom message')
  })

  it('does not set meta.fixable when fix is not enabled', () => {
    expect(createRule(id).meta.fixable).toBeUndefined()
  })

  it("sets meta.fixable to 'code' when .to() is present", () => {
    expect(
      createRule(
        U.Identifier({ name: $('n') }).to(it => U.Identifier({ name: it.n })),
        { fix: true },
      ).meta.fixable,
    ).toBe('code')
  })

  it('creates a visitor for the correct AST node type', () => {
    const { visitors } = lintWith(createRule(ifStmt))
    expect(visitors).toHaveProperty('IfStatement')
    expect(typeof visitors.IfStatement).toBe('function')
  })

  it("runs a Comment entry from Program, at the comment's loc", () => {
    const { visitors, reported } = lintWith(
      createRule(U.Comment({ kind: 'line' })),
    )
    expect(Object.keys(visitors)).toEqual(['Program'])
    visitors.Program(asNode(Fixtures.LINE_COMMENT_PROGRAM))
    expect(reported).toHaveLength(1)
    expect(reported[0]).toMatchObject({
      loc: Fixtures.LINE_COMMENT_PROGRAM.comments[0].loc,
    })
    expect(reported[0]).not.toHaveProperty('node')
  })

  it('visitor calls context.report when a node matches', () => {
    const { visitors, reported } = lintWith(
      createRule(id, { message: 'Found {{n}}' }),
    )
    visitors.Identifier(asNode({ type: 'Identifier', name: 'foo' }))
    expect(reported).toHaveLength(1)
    expect(reported[0].messageId).toBe('match')
    expect(reported[0].data).toEqual({ n: 'foo' })
  })

  it('visitor does not report a node whose literal field differs', () => {
    const { visitors, reported } = lintWith(
      createRule(U.Identifier({ name: 'specific' })),
    )
    visitors.Identifier(asNode({ type: 'Identifier', name: 'other' }))
    expect(reported).toHaveLength(0)
  })

  it('resolves config slots in imports from the chain config defaults', () => {
    const rule = createRule(
      U.ArrayExpression({ elements: [$('arr')] })
        .to(it =>
          U.CallExpression({
            callee: U.Identifier({ name: 'uniq' }),
            arguments: [it.arr as TSESTree.Expression],
          }),
        )
        .imports({ uniq: C('from') })
        .config({ from: 'lodash' }),
      { fix: true },
    )
    expect(rule.meta.fixable).toBe('code')

    const { visitors, reported, fixes } = lintWith(rule, {
      getText: () => 'const x = [myArr];',
    })
    visitors.ArrayExpression(asNode(Fixtures.ARRAY_NODE))
    expect(reported).toHaveLength(1)
    expect(fixes).toHaveLength(1)
    expect(fixes[0]).toMatchObject([
      {
        range: [0, 0],
        text: expect.stringContaining('import { uniq } from "lodash"'),
      },
      { range: Fixtures.ARRAY_NODE.range },
    ])
  })

  it('does not add imports when they already exist in the source', () => {
    const { visitors, reported, fixes } = lintWith(
      createRule(
        U.Identifier({ name: $('n') })
          .to(it => U.Identifier({ name: it.n }))
          .imports({ uniq: 'lodash' })
          .config({}),
        { fix: true },
      ),
      { getText: () => 'import { uniq } from "lodash";\nconst x = foo;' },
    )
    visitors.Identifier(asNode(Fixtures.FOO_NODE))
    expect(reported).toHaveLength(1)
    expect(Array.isArray(fixes[0])).toBe(false)
  })

  it('reports both branches of a root or that share a node type', () => {
    const { visitors, reported } = lintWith(
      createRule(
        U.or(
          U.VariableDeclaration({ kind: 'let' }),
          U.VariableDeclaration({ kind: 'var' }),
        ),
      ),
    )
    expect(Object.keys(visitors)).toEqual(['VariableDeclaration'])

    for (const kind of ['let', 'var', 'const']) {
      visitors.VariableDeclaration(
        asNode({ type: 'VariableDeclaration', kind, declarations: [] }),
      )
    }

    expect(reported.map(d => ('node' in d ? d.node : null))).toMatchObject([
      { kind: 'let' },
      { kind: 'var' },
    ])
  })

  it('honours a .when() on a root or after the branch matched', () => {
    const { visitors, reported } = lintWith(
      createRule(
        U.or(U.Identifier({ name: $('n') }), U.Literal({ value: $('n') })).when(
          (it: { n: unknown }) => it.n !== 'skip',
        ),
      ),
    )
    visitors.Identifier(asNode({ type: 'Identifier', name: 'skip' }))
    visitors.Identifier(asNode({ type: 'Identifier', name: 'keep' }))
    visitors.Literal(asNode({ type: 'Literal', value: 'skip' }))
    visitors.Literal(asNode({ type: 'Literal', value: 1 }))
    expect(reported.map(d => d.data?.n)).toEqual(['keep', '1'])
  })

  describe('over U.Comment', () => {
    const noInlineComments = U.or(
      U.Comment({
        kind: U.or('line', 'block'),
        text: $('text'),
        header: $('isHeader'),
      }).when(it => !Fixtures.DIRECTIVE.test(it.text)),
      U.Comment({
        kind: 'jsdoc',
        attachedTo: null,
        text: $('text'),
        header: $('isHeader'),
      }),
    )
      .when(({ text, isHeader }) => !(isHeader && Fixtures.LICENSE.test(text)))
      .message(
        'a comment here means this code wants a name: extract it to a ' +
          'binding and put the explanation in its JSDoc',
      )

    const jsdocShape = U.or(
      U.Comment({ kind: 'jsdoc', summary: [$, $, $, ...$] }),
      U.Comment({ kind: 'jsdoc', body: [...$, '', ...$] }),
      U.Comment({ kind: 'jsdoc', body: [$, $, $, $, ...$] }),
      U.Comment({ kind: 'jsdoc', tags: [...$, { text: /\n[^]*\n/ }, ...$] }),
      U.Comment({ kind: 'jsdoc', text: /^@\w[^]*\n\n/m }),
    ).message(
      'JSDoc overflows: summary max 2, body max 3, each tag max 2, nothing ' +
        'after the tags',
    )

    const jsdocLineWidth = U.Comment({
      kind: 'jsdoc',
      lines: $('lines'),
      loc: $('loc'),
    })
      .when(({ lines, loc }) =>
        lines.some(
          (l, i) =>
            (i === 0 ? loc.start.column : 0) + l.length > Fixtures.COLUMNS,
        ),
      )
      .message('a JSDoc line is over 80 columns; the file is formatted at 80')

    const NAME = U.Identifier({ name: $('name') })
    const KEY = U.or(
      U.Identifier({ name: $('name') }),
      U.Literal({ value: $('name') }),
    )
    const TOP = U.or(
      U.FunctionDeclaration({ id: NAME }),
      U.TSDeclareFunction({ id: NAME }),
      U.ClassDeclaration({ id: NAME }),
      U.TSInterfaceDeclaration({ id: NAME }),
      U.TSTypeAliasDeclaration({ id: NAME }),
      U.TSEnumDeclaration({ id: NAME }),
      U.TSModuleDeclaration({ id: NAME }),
    )
    const VARIABLE = U.VariableDeclaration({
      declarations: [U.VariableDeclarator({ id: NAME }), ...$],
    })
    const DECLARATION = U.or(
      TOP,
      VARIABLE,
      U.or(
        U.TSEnumMember({ id: KEY }),
        U.MethodDefinition({ key: KEY }),
        U.TSAbstractMethodDefinition({ key: KEY }),
        U.PropertyDefinition({ key: KEY }),
        U.TSAbstractPropertyDefinition({ key: KEY }),
        U.TSPropertySignature({ key: KEY }),
        U.TSMethodSignature({ key: KEY }),
        U.Property({ key: KEY }),
      ),
      U.ExportNamedDeclaration({ declaration: U.or(TOP, VARIABLE) }),
      U.ExportDefaultDeclaration({ declaration: TOP }),
    )

    /**
     * Whether every content word of a summary is already in the name.
     */
    function restates(name: unknown, summary: string) {
      if (typeof name !== 'string') return false

      const tokens = Fixtures.identifierTokens(name)
      const words = (summary.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter(
        w => !Fixtures.STOPWORDS.has(w),
      )

      return (
        words.length !== 0 &&
        words.every(
          w =>
            tokens.has(w) ||
            tokens.has(w.replace(/s$/, '')) ||
            tokens.has(w + 's'),
        )
      )
    }

    const jsdocNotRestating = U.Comment({
      kind: 'jsdoc',
      summary: $('summary'),
      body: [],
      tags: $('tags'),
      attachedTo: DECLARATION,
    })
      .when(
        ({ name, summary, tags }) =>
          !tags.some(t => t.text.includes('\n')) &&
          restates(name, summary.join(' ')),
      )
      .message(
        'this JSDoc restates the name; say what a reader cannot derive, or ' +
          'delete it',
      )

    const noUnicodeComment = U.Comment({ text: /[^\x00-\x7f]/ }).message(
      'non-ASCII character in a comment: spell it in ASCII',
    )

    it("reports at the comment's own location", () => {
      expect(
        lint(noInlineComments, 'const a = 1; // trailing\nconst b = 2;'),
      ).toEqual([
        {
          line: 1,
          column: 14,
          endLine: 1,
          endColumn: 25,
          message: expect.stringContaining('wants a name'),
        },
      ])
    })

    it('no-inline-comments', () => {
      valid(noInlineComments, [
        '// Copyright 2026 Example Corp. MIT License.\nconst a = 1;',
        '// eslint-disable-next-line no-console\nconsole.log(1);',
        '// oxlint-disable-next-line no-explicit-any -- the SDK types it ' +
          'so\nlet x: any;',
        '/* eslint no-console: off */\nconsole.log(1);',
        '// @ts-expect-error wrong lib types\nfoo();',
        '// prettier-ignore\nconst m = [1, 0, 0, 1];',
        '/** A handler. */\nexport const onEvent = () => {};',
        '/** Shape of a row. */\ntype Row = { a: 1 };',
        'class A {\n  /** The count. */\n  n = 0;\n  /** Bumps it. */\n  ' +
          'bump() {}\n}',
        'enum E {\n  /** first */\n  A,\n}',
        'interface I {\n  /** width in cells */\n  w: number;\n}',
        "const o = {\n  /** hook name */\n  name: 'x',\n};",
      ])
      invalid(noInlineComments, [
        '// why this is here\nconst a = 1;',
        'const a = 1; // trailing\n',
        '/* block */\nconst a = 1;',
        'const a = 1;\n// Copyright late in the file\nconst b = 2;',
        '/** floating */\nfoo();',
        'function f() {\n  /** inside */\n  return 1;\n}',
        'const y = x as string; // -- the field is validated upstream',
      ])
    })

    it('jsdoc-shape', () => {
      valid(jsdocShape, [
        '/** One line. */\nfunction f() {}',
        '/**\n * Two\n * lines.\n */\nfunction f() {}',
        '/**\n * Summary.\n *\n * Body one.\n * Body two.\n * Body three.' +
          '\n * @param a the a\n * @returns b\n */\nfunction f(a) {}',
        '/**\n * Summary.\n * @example\n * f(1)\n */\nfunction f(a) {}',
        '// not jsdoc\nconst a = 1;',
      ])
      invalid(jsdocShape, [
        '/**\n * One\n * two\n * three.\n */\nfunction f() {}',
        '/**\n * S.\n *\n * a\n * b\n * c\n * d\n */\nfunction f() {}',
        '/**\n * S.\n *\n * a\n *\n * b\n */\nfunction f() {}',
        '/**\n * S.\n * @param a one\n * two\n * three\n */\nfunction f(a) {}',
        '/**\n * S.\n * @returns r\n *\n * after\n */\nfunction f() {}',
      ])
    })

    it('jsdoc-line-width', () => {
      valid(jsdocLineWidth, Fixtures.JSDOC_WIDTH_SAMPLES.within)
      invalid(jsdocLineWidth, Fixtures.JSDOC_WIDTH_SAMPLES.over)
    })

    it('jsdoc-not-restating', () => {
      valid(jsdocNotRestating, [
        '/** Rejects a header whose magic number is wrong. */\nfunction ' +
          'parseHeader() {}',
        '/** Cached per process; cleared on SIGHUP. */\nexport const ' +
          "userName = '';",
        '/** The count. */\nfoo();',
        '/**\n * Loads config.\n *\n * Reads from disk once.\n */\nfunction ' +
          'loadConfig() {}',
        '/**\n * Loads config.\n * @param x one\n *   and more\n */\n' +
          'function loadConfig(x) {}',
      ])
      invalid(jsdocNotRestating, [
        '/** Gets the user name. */\nfunction getUserName() {}',
        '/** Parse header. */\nexport function parseHeader() {}',
        'class A {\n  /** The on event handler. */\n  onEventHandler() {}\n}',
        '/** Max retries */\nconst MAX_RETRIES = 3;',
        '/** Max retries */\nexport default class MaxRetries {}',
      ])
    })

    it('no-unicode in comments', () => {
      valid(noUnicodeComment, [
        '// plain ascii comment\nconst a = 1;',
        "const s = 'café';",
      ])
      invalid(noUnicodeComment, [
        '// arrow → here\nconst a = 1;',
        '/** box ── art */\nconst a = 1;',
      ])
    })
  })

  describe('with string predicates', () => {
    /**
     * A destructuring property that renames a key which could have been
     * the binding: `{ key: name }` with `key` an unreserved IdentifierName.
     *
     * The predicate sits on the capture over the `U.or`, once for both
     * spellings of the key, and the guard types `key` as a string in the
     * bag.
     */
    const renamedKey = U.Property({
      computed: false,
      shorthand: false,
      key: U.or(
        U.Identifier({ name: $('key') }),
        U.Literal({ value: $('key') }),
      ).when(
        (bag: { key: unknown }): bag is { key: string } =>
          U.string.identifierName()(bag.key) && !U.string.reserved()(bag.key),
      ),
      value: U.Identifier({ name: $('name') }),
    }).message('{{key}} renamed to {{name}}')

    /**
     * The slot form, for a slot with nothing to capture.
     */
    const reservedName = U.Identifier({
      name: U.string.reserved({ typescript: true }),
    }).message('reserved')

    const messages = (rule: unknown, code: string) =>
      lint(rule, code).map(r => r.message)

    it('applies a .when over a U.or capture once, for either key', () => {
      expect(messages(renamedKey, 'const { a: b } = o;')).toEqual([
        'a renamed to b',
      ])
      expect(messages(renamedKey, "const { 'a': b } = o;")).toEqual([
        'a renamed to b',
      ])
      expect(messages(renamedKey, 'const { class: b } = o;')).toEqual([])
      expect(messages(renamedKey, "const { 'data-id': b } = o;")).toEqual([])
      expect(messages(renamedKey, 'const { 1: b } = o;')).toEqual([])
      expect(messages(renamedKey, 'const { a } = o;')).toEqual([])
    })

    it('tests a slot with a predicate the way it does with a RegExp', () => {
      expect(messages(reservedName, 'o.type;')).toEqual(['reserved'])
      expect(messages(reservedName, 'o.kind;')).toEqual([])
      expect(
        messages(U.Identifier({ name: /^ki/ }).message('re'), 'o.kind;'),
      ).toEqual(['re'])
    })
  })
})
