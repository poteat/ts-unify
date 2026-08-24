import { parse } from '@typescript-eslint/typescript-estree'

import { printNode } from './print-node'

const first = (src: string) => parse(src, { range: true, loc: true }).body[0]

describe('print-node', () => {
  const signatures =
    'interface I {\n  (a: number): void;\n  new (b: string): I;\n  m<T>(c: ' +
    'T): T;\n}'

  it('keeps type arguments on a type reference', () => {
    expect(printNode(first('type T = ReturnType<typeof f>;'))).toBe(
      'type T = ReturnType<typeof f>;',
    )
  })

  it('prints a function type with its parameters and return type', () => {
    expect(printNode(first('type F = (x: string) => string;'))).toBe(
      'type F = (x: string) => string;',
    )
  })

  it('prints call, construct and method signatures', () => {
    expect(printNode(first(signatures)).replace(/\s+/g, ' ')).toBe(
      signatures.replace(/\s+/g, ' '),
    )
  })

  it('keeps type arguments on calls and instantiation expressions', () => {
    expect(printNode(first('f<number>(1);'))).toBe('f<number>(1);')
  })

  it('does not mutate the input node', () => {
    const node = first('type T = ReturnType<typeof f>;')
    printNode(node)
    expect(node).not.toHaveProperty('typeAnnotation.typeParameters')
    expect(node).toHaveProperty('typeAnnotation.typeArguments')
  })
})
