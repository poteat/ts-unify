import type {
  CommentNode,
  CommentKind,
  JsdocTag,
} from '@ts-unify/core/internal'
import type { TSESTree } from '@typescript-eslint/types'

type Program = {
  type: 'Program'
  comments?: TSESTree.Comment[]
  tokens?: { range: TSESTree.Range }[]
}

/**
 * Node kinds a comment documents when it sits right before one.
 */
const DECLARATIONS = new Set<string>([
  'FunctionDeclaration',
  'TSDeclareFunction',
  'ClassDeclaration',
  'ClassExpression',
  'VariableDeclaration',
  'TSInterfaceDeclaration',
  'TSTypeAliasDeclaration',
  'TSEnumDeclaration',
  'TSEnumMember',
  'TSModuleDeclaration',
  'MethodDefinition',
  'TSAbstractMethodDefinition',
  'PropertyDefinition',
  'TSAbstractPropertyDefinition',
  'TSPropertySignature',
  'TSMethodSignature',
  'Property',
  'ExportNamedDeclaration',
  'ExportDefaultDeclaration',
  'ExportAllDeclaration',
])

const SKIP_KEYS = new Set(['parent', 'loc', 'range', 'comments', 'tokens'])

const cache = new WeakMap<
  object,
  { list: CommentNode[]; byRaw: WeakMap<object, CommentNode> }
>()

/**
 * The comments of a parsed program as `Comment` nodes, in source order.
 * Built once per program object and cached; see `CommentNode` for the
 * shape and the attachment rule.
 *
 * @param program A `Program` node with `comments` (and, for attachment,
 * `tokens`) as produced by a parser with `comment: true, tokens: true`.
 */
export const commentNodes = (program: unknown): CommentNode[] =>
  views(program).list

/**
 * The `Comment` node of one raw parser comment of `program`, if any.
 */
export const commentNodeOf = (
  program: unknown,
  raw: unknown,
): CommentNode | undefined =>
  !raw || typeof raw !== 'object' ? undefined : views(program).byRaw.get(raw)

function views(program: unknown): {
  list: CommentNode[]
  byRaw: WeakMap<object, CommentNode>
} {
  const p = program as Program
  if (!p || typeof p !== 'object') return { list: [], byRaw: new WeakMap() }
  const hit = cache.get(p)
  if (hit) return hit
  const raws = p.comments ?? []
  const starts = declarationStarts(p)
  const tokenStarts = (p.tokens ?? []).map(t => t.range[0])
  const byRaw = new WeakMap<object, CommentNode>()
  const firstToken = tokenStarts[0] ?? Infinity
  const list = raws.map((raw, index) => {
    const node = toCommentNode(
      raw,
      index === 0 && raw.range[1] <= firstToken,
      p,
      starts,
      tokenStarts,
    )
    byRaw.set(raw, node)

    return node
  })
  const built = { list, byRaw }
  cache.set(p, built)

  return built
}

function toCommentNode(
  raw: TSESTree.Comment,
  header: boolean,
  program: Program,
  starts: Map<number, TSESTree.Node>,
  tokenStarts: number[],
): CommentNode {
  const kind: CommentKind =
    raw.type === 'Line' ? 'line' : raw.value.startsWith('*') ? 'jsdoc' : 'block'
  const lines = kind === 'jsdoc' ? jsdocLines(raw.value) : null
  const parts = lines ? jsdocParts(lines) : { summary: [], body: [], tags: [] }

  return {
    type: 'Comment',
    kind,
    text: lines ? lines.join('\n') : raw.value,
    lines: (raw.type === 'Line' ? `//${raw.value}` : `/*${raw.value}*/`).split(
      '\n',
    ),
    ...parts,
    attachedTo: attachedDeclaration(raw, starts, tokenStarts),
    header,
    loc: raw.loc,
    range: raw.range,
    parent: program as unknown as TSESTree.Program,
  }
}

/**
 * Lines of a JSDoc value with the leading `*` per line stripped and blank edges
 * dropped.
 */
function jsdocLines(value: string): string[] {
  const lines = value
    .replace(/^\* ?/, '')
    .split('\n')
    .map(l => l.replace(/^\s*\*\s?/, '').replace(/\s+$/, ''))

  while (lines.length > 0 && lines[0] === '') lines.shift()

  while (lines.length > 0 && lines[lines.length - 1] === '') lines.pop()

  return lines
}

const isTagLine = (l: string) => /^@\w/.test(l)

function jsdocParts(lines: string[]): {
  summary: string[]
  body: string[]
  tags: JsdocTag[]
} {
  let i = 0
  const summary: string[] = []

  while (i < lines.length && lines[i] !== '' && !isTagLine(lines[i]))
    summary.push(lines[i++])

  const body: string[] = []

  if (i < lines.length && lines[i] === '') {
    i++

    while (i < lines.length && !isTagLine(lines[i])) body.push(lines[i++])
    // A blank line before the first tag separates the prose from the tags
    // and is no line of the body.
    if (body.length > 0 && body[body.length - 1] === '' && i < lines.length)
      body.pop()
  }

  const tags: JsdocTag[] = []

  while (i < lines.length) {
    const line = lines[i++]
    if (!isTagLine(line)) continue
    const space = line.search(/\s/)
    const name = space === -1 ? line : line.slice(0, space)
    const text = [space === -1 ? '' : line.slice(space + 1).trimStart()]

    while (i < lines.length && lines[i] !== '' && !isTagLine(lines[i]))
      text.push(lines[i++].trimStart())

    tags.push({ name, text: text.join('\n') })
  }

  return { summary, body, tags }
}

/**
 * Map from a start offset to the outermost declaration starting there.
 * Parents are visited before children, so the first writer wins.
 */
function declarationStarts(program: Program): Map<number, TSESTree.Node> {
  const starts = new Map<number, TSESTree.Node>()

  function visit(node: unknown): void {
    const rec = node as Record<string, unknown> | null
    if (!rec || typeof rec !== 'object' || typeof rec.type !== 'string') return
    const range = rec.range as TSESTree.Range | undefined

    if (range && DECLARATIONS.has(rec.type) && !starts.has(range[0])) {
      starts.set(range[0], node as TSESTree.Node)
    }

    for (const key of Object.keys(rec)) {
      if (SKIP_KEYS.has(key)) continue
      const child = rec[key]
      Array.isArray(child) ? child.forEach(visit) : visit(child)
    }
  }

  visit(program)

  return starts
}

/**
 * The outermost declaration starting at the first token after `raw`.
 */
function attachedDeclaration(
  raw: TSESTree.Comment,
  starts: Map<number, TSESTree.Node>,
  tokenStarts: number[],
): TSESTree.Node | null {
  const next = firstAtOrAfter(tokenStarts, raw.range[1])

  return next === undefined ? null : (starts.get(next) ?? null)
}

/**
 * Smallest element of a sorted array that is `>= at`.
 */
function firstAtOrAfter(sorted: number[], at: number): number | undefined {
  let lo = 0
  let hi = sorted.length

  while (lo < hi) {
    const mid = (lo + hi) >> 1
    sorted[mid] < at ? (lo = mid + 1) : (hi = mid)
  }

  return sorted[lo]
}
