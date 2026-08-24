# CommentNode

## Overview

`CommentNode` is the shape a comment takes when it is matched as a node. Parsers
keep comments beside the tree, not in it; this type gives them a `type`
discriminant (`"Comment"`) and a `kind`, so `U.Comment({ ... })` is a pattern
like any other.

## Scope

- Provider-facing: the shape only. Building these values from a parsed program
  is the engine's job; see its `comment-nodes` module.
- Keyed into `NodeKind` and `NodeByKind` as `"Comment"`.

## Design

- One shape for all kinds. The JSDoc parts (`summary`, `body`, `tags`) are
  empty arrays on `line` and `block` comments, so a pattern over them never
  needs a kind guard to be well typed.
- `summary` and `body` are arrays of lines, so sequence patterns count lines:
  `summary: [$, $, $, ...$]` matches a summary of three or more lines.
- `lines` keeps the source as written (`/**`, ` * `, indentation of the
  continuation lines, `*/`), for rules about layout such as line width. The
  first line starts at `loc.start.column`; the others start at column 0.
- `attachedTo` is a plain `TSESTree.Node | null`, so a nested node pattern (or
  a `U.or` of several) reads the declaration's name in the same match.
- `header` marks a comment that opens the file, so a license or module header
  is one field away: `U.Comment({ header: true })`.

## Semantics

- `kind` is `"line"` for `//`, `"block"` for `/* */`, `"jsdoc"` for a block
  whose value starts with `*` (`/** */`).
- `text` is the comment value without delimiters. For `jsdoc` it is the lines
  with the leading `*` (and one following space) removed, trailing whitespace
  removed, and leading and trailing blank lines dropped, joined by `\n`. The
  first line has no `*` of its own; its one leading space goes too.
- `lines` is the source text of the comment (`//` or `/*` through `*/`) split
  at `\n`. A single-line comment has one entry.
- For `jsdoc`, with the lines of `text`:
  - `summary` is the lines before the first blank line or first tag line.
  - `body` is the lines after that blank line and before the first tag line,
    blank lines kept. It is empty when a tag line ends the summary.
  - `tags` has one entry per line starting with `@word`: `name` is the word,
    `text` is the rest of that line plus the non-blank lines that follow it
    before the next tag line or blank line, each with its leading whitespace
    removed, joined by `\n`.
  - A blank line inside the tag region and the lines after it belong to no
    part; they are visible only in `text`.
- `attachedTo` is the outermost declaration node that starts at the first token
  after the comment, or `null`. Declarations are: function, class, variable,
  interface, type alias, enum, enum member, module, method and property
  definitions (abstract too), property and method signatures, object
  properties, and export declarations. A comment followed by a statement that
  is not a declaration, by a closing brace, or by nothing is attached to
  nothing. Line breaks between the comment and the token do not matter.
- `header` is `true` when no token and no other comment starts before the
  comment; a shebang line does not count, parsers keep it out of both lists.

## Examples

```ts
U.Comment({ kind: "jsdoc", attachedTo: null });
U.Comment({ header: true, text: /licen[cs]e/i });
U.Comment({ kind: "jsdoc", summary: [$, $, $, ...$] });
U.Comment({ attachedTo: U.FunctionDeclaration({ id: U.Identifier({ name: $("name") }) }) });
```

## Non-Goals

- Tokens. A comment is the only trivia with a node view.
- A `leadingComment` field on declarations: the reverse link is `attachedTo`.
