import { parse } from '@typescript-eslint/typescript-estree'

import { commentNodeOf } from './comment-node-of'
import { commentNodes } from './comment-nodes'
import Fixtures from './fixtures'

const headers = (code: string) =>
  commentNodes(Fixtures.program(code)).map(c => c.isHeader)

describe('comment-nodes', () => {
  it('gives every comment a kind and its text without delimiters', () => {
    const [line, block, jsdoc] = commentNodes(
      Fixtures.program('// a\n/* b */\n/** c ' + '*/\nx;'),
    )

    expect(line).toMatchObject({
      type: 'Comment',
      kind: 'line',
      text: ' a',
      isHeader: true,
    })

    expect(block).toMatchObject({
      kind: 'block',
      text: ' b ',
      isHeader: false,
    })

    expect(jsdoc).toMatchObject({
      kind: 'jsdoc',
      text: 'c',
      isHeader: false,
    })
  })

  it('returns an empty list for a program without comments', () => {
    expect(commentNodes(Fixtures.program('x;'))).toEqual([])
    expect(commentNodes(null)).toEqual([])
  })

  it('is built once per program', () => {
    const ast = Fixtures.program('// a\nx;')
    expect(commentNodes(ast)).toBe(commentNodes(ast))
    expect(commentNodeOf(ast, ast.comments[0])).toBe(commentNodes(ast)[0])
  })

  it('strips the leading star of every jsdoc line and the blank edges', () => {
    expect(
      commentNodes(
        Fixtures.program(
          '/**\n *\n * Summary line.\n *   indented\n *\n ' + '*/\nx;',
        ),
      )[0].text,
    ).toBe('Summary line.\n  indented')
  })

  it('splits a jsdoc into summary, body and tags', () => {
    const [c] = commentNodes(
      Fixtures.program(
        [
          '/**',
          ' * First line.',
          ' * Second line.',
          ' *',
          ' * Body one.',
          ' * Body two.',
          ' * @param x the x',
          ' *   continued',
          ' * @returns y',
          ' */',
          'function f(x) {}',
        ].join('\n'),
      ),
    )

    expect(c.summary).toEqual(['First line.', 'Second line.'])
    expect(c.body).toEqual(['Body one.', 'Body two.'])

    expect(c.tags).toEqual([
      {
        name: '@param',
        text: 'x the x\ncontinued',
      },
      {
        name: '@returns',
        text: 'y',
      },
    ])
  })

  it('keeps blank lines inside the body', () => {
    expect(
      commentNodes(
        Fixtures.program('/**\n * S\n *\n * B1\n *\n * B2\n */\nx;'),
      )[0].body,
    ).toEqual(['B1', '', 'B2'])
  })

  it('leaves the body empty when a tag ends the summary', () => {
    const tagged = commentNodes(
      Fixtures.program('/**\n * S\n * @see x\n */\nx;'),
    )[0]
    expect(tagged.summary).toEqual(['S'])
    expect(tagged.body).toEqual([])

    expect(tagged.tags).toEqual([
      {
        name: '@see',
        text: 'x',
      },
    ])
  })

  it('keeps the source lines as written', () => {
    const [doc, trailing] = commentNodes(
      Fixtures.program('  /**\n   * Summary.\n   ' + '*/\n  x; // t'),
    )
    expect(doc.lines).toEqual(['/**', '   * Summary.', '   */'])
    expect(doc.loc.start.column).toBe(2)
    expect(trailing.lines).toEqual(['// t'])
  })

  it('leaves the jsdoc parts empty on line and block comments', () => {
    const [c] = commentNodes(Fixtures.program('/* not jsdoc */\nx;'))
    expect(c).toMatchObject({ kind: 'block', summary: [], body: [], tags: [] })
  })

  it('attaches to the outermost declaration at the next token', () => {
    const [doc, inner] = commentNodes(
      Fixtures.program(
        '/** doc */\nexport const a = ' + '1;\n// inner\nfunction f() ' + '{}',
      ),
    )
    expect(doc.attachedTo?.type).toBe('ExportNamedDeclaration')
    expect(inner.attachedTo?.type).toBe('FunctionDeclaration')
  })

  it('attaches class members, object properties and interface members', () => {
    expect(
      commentNodes(
        Fixtures.program(
          'class A {\n  /** m */\n  m() {}\n  /** p */\n  p = 1;\n}\nconst o ' +
            '= {\n  /** k */\n  k: 1,\n};\ninterface I {\n  /** s */\n  s: ' +
            'number;\n}',
        ),
      ).map(c => c.attachedTo?.type),
    ).toEqual([
      'MethodDefinition',
      'PropertyDefinition',
      'Property',
      'TSPropertySignature',
    ])
  })

  it('attaches nothing when the next token starts no declaration', () => {
    expect(
      commentNodes(
        Fixtures.program(
          'function f() {\n  // trailing in body\n}\nfoo(); /* after call ' +
            '*/\n// before a call\nbar();\n// last',
        ),
      ).map(c => c.attachedTo),
    ).toEqual([null, null, null, null])
  })

  it('attaches nothing without tokens', () => {
    expect(
      commentNodes(
        parse('/** doc */\nfunction f() {}', {
          comment: true,
          loc: true,
          range: true,
        }),
      )[0].attachedTo,
    ).toBeNull()
  })

  it('marks only a first comment before all code as the header', () => {
    expect(headers('// a\n// b\nx;')).toEqual([true, false])
    expect(headers('x; // a\n// b')).toEqual([false, false])
    expect(headers('\n\n  /* a */ x;')).toEqual([true])
    expect(headers('// only')).toEqual([true])
  })

  it('points loc and range at the comment itself', () => {
    const ast = Fixtures.program('x;\n  // here')
    const [c] = commentNodes(ast)
    expect(c.loc.start).toEqual({ line: 2, column: 2 })
    expect(c.range).toEqual([5, 12])
    expect(c.parent).toBe(ast)
  })
})
