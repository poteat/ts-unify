import { U, $ } from '@ts-unify/core'
import { parse } from '@typescript-eslint/typescript-estree'

import CommentNodes from '../comment-nodes'

import { match } from './match'

const program = (code: string) =>
  parse(code, { comment: true, tokens: true, loc: true, range: true })

describe('match - comments', () => {
  it('matches a Comment node directly, with captures on its fields', () => {
    const [c] = CommentNodes.commentNodes(program('// todo later\nx;'))

    expect(
      match(
        c,
        U.Comment({
          kind: 'line',
          text: $('text'),
        }),
      ),
    ).toEqual({
      text: ' todo later',
    })

    expect(
      match(
        c,
        U.Comment({
          kind: 'block',
        }),
      ),
    ).toBeNull()
  })

  it('matches raw comments under Program.comments through their node view', () => {
    const bag = match(
      program('/** header */\n// a\nexport const x = 1;'),
      U.Program({
        comments: [
          U.Comment({
            kind: 'jsdoc',
            text: $('h'),
          }),
          ...$('rest'),
        ],
      }),
    )

    expect(bag).not.toBeNull()
    expect(bag!.h).toBe('header')
    expect(bag!.rest).toHaveLength(1)
  })

  it('finds a comment anywhere in the list with two spreads', () => {
    const bag = match(
      program('// a\n/* b */\n// c\nx;'),
      U.Program({
        comments: [
          ...$,
          U.Comment({
            kind: 'block',
            text: $('b'),
          }),
          ...$,
        ],
      }),
    )

    expect(bag!.b).toBe(' b ')
  })

  it('does not match a raw comment against U.Comment outside a Program match', () => {
    expect(match(program('// a\nx;').comments[0], U.Comment())).toBeNull()
  })

  it('reads the attached declaration through a nested pattern', () => {
    const [c] = CommentNodes.commentNodes(
      program('/** Adds. */\nfunction ' + 'add() {}'),
    )

    expect(
      match(
        c,
        U.Comment({
          kind: 'jsdoc',
          summary: $('summary'),

          attachedTo: U.FunctionDeclaration({
            id: U.Identifier({
              name: $('name'),
            }),
          }),
        }),
      ),
    ).toMatchObject({
      name: 'add',
      summary: ['Adds.'],
    })
  })

  it('counts summary lines with a sequence pattern', () => {
    const long = CommentNodes.commentNodes(
      program('/**\n * one\n * two\n * three\n */\nx;'),
    )[0]
    const short = CommentNodes.commentNodes(program('/** one */\nx;'))[0]
    const threeOrMore = U.Comment({ kind: 'jsdoc', summary: [$, $, $, ...$] })
    expect(match(long, threeOrMore)).not.toBeNull()
    expect(match(short, threeOrMore)).toBeNull()
  })

  it('matches a null attachedTo literally', () => {
    const [floating, doc] = CommentNodes.commentNodes(
      program(
        'function f() ' +
          '{\n  /** ' +
          'floating ' +
          '*/\n}\n/** ' +
          'doc ' +
          '*/\nconst a ' +
          '= 1;',
      ),
    )

    const detached = U.Comment({
      kind: 'jsdoc',
      attachedTo: null,
    })

    expect(match(floating, detached)).toEqual({})
    expect(match(doc, detached)).toBeNull()
  })
})
