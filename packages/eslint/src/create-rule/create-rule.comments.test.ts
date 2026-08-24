import { Linter } from "eslint";
import { parse } from "@typescript-eslint/typescript-estree";
import { U, $ } from "@ts-unify/core";
import { createRule } from "./create-rule";

// Four rules about comments, written as patterns over `U.Comment`. They
// double as the worked examples for the `Comment` node kind.

/** Tool directives, by their first token. */
const DIRECTIVE = /^\s*(oxlint-|eslint-|eslint\s|eslint$|@ts-(expect-error|ignore|nocheck|check)\b|prettier-ignore|biome-ignore|c8 ignore|v8 ignore|istanbul ignore)/;
const LICENSE = /\b(copyright|licen[cs]e|spdx)\b/i;

/** Every comment, except directives, a license header and a JSDoc on a declaration. */
const noInlineComments = U.or(
  U.Comment({ kind: U.or("line", "block"), text: $("text"), header: $("header") }).when(
    ({ text }) => !DIRECTIVE.test(text),
  ),
  U.Comment({ kind: "jsdoc", attachedTo: null, text: $("text"), header: $("header") }),
)
  .when(({ text, header }) => !(header && LICENSE.test(text)))
  .message("a comment here means this code wants a name: extract it to a binding and put the explanation in its JSDoc");

/** Summary max 2 lines, body max 3 with one blank before it, each tag max 2 lines, nothing after the tags. */
const jsdocShape = U.or(
  U.Comment({ kind: "jsdoc", summary: [$, $, $, ...$] }),
  U.Comment({ kind: "jsdoc", body: [...$, "", ...$] }),
  U.Comment({ kind: "jsdoc", body: [$, $, $, $, ...$] }),
  U.Comment({ kind: "jsdoc", tags: [...$, { text: /\n[^]*\n/ }, ...$] }),
  U.Comment({ kind: "jsdoc", text: /^@\w[^]*\n\n/m }),
).message("JSDoc overflows: summary max 2, body max 3, each tag max 2, nothing after the tags");

/** Every source line of a JSDoc block fits the file's 80 columns; the first line starts at its column. */
const jsdocLineWidth = U.Comment({ kind: "jsdoc", lines: $("lines"), loc: $("loc") })
  .when(({ lines, loc }) => lines.some((l, i) => (i === 0 ? loc.start.column : 0) + l.length > 80))
  .message("a JSDoc line is over 80 columns; the file is formatted at 80");

const NAME = U.Identifier({ name: $("name") });
const KEY = U.or(U.Identifier({ name: $("name") }), U.Literal({ value: $("name") }));
const TOP = U.or(
  U.FunctionDeclaration({ id: NAME }),
  U.TSDeclareFunction({ id: NAME }),
  U.ClassDeclaration({ id: NAME }),
  U.TSInterfaceDeclaration({ id: NAME }),
  U.TSTypeAliasDeclaration({ id: NAME }),
  U.TSEnumDeclaration({ id: NAME }),
  U.TSModuleDeclaration({ id: NAME }),
);
const VARIABLE = U.VariableDeclaration({ declarations: [U.VariableDeclarator({ id: NAME }), ...$] });
const MEMBER = U.or(
  U.TSEnumMember({ id: KEY }),
  U.MethodDefinition({ key: KEY }),
  U.TSAbstractMethodDefinition({ key: KEY }),
  U.PropertyDefinition({ key: KEY }),
  U.TSAbstractPropertyDefinition({ key: KEY }),
  U.TSPropertySignature({ key: KEY }),
  U.TSMethodSignature({ key: KEY }),
  U.Property({ key: KEY }),
);
const DECLARATION = U.or(
  TOP,
  VARIABLE,
  MEMBER,
  U.ExportNamedDeclaration({ declaration: U.or(TOP, VARIABLE) }),
  U.ExportDefaultDeclaration({ declaration: TOP }),
);

/** camelCase / snake_case / digit-boundary split, lowercased. */
function identifierTokens(name: string): Set<string> {
  const spaced = name
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/([a-zA-Z])([0-9])/g, "$1 $2")
    .replace(/[_$-]+/g, " ");
  return new Set(spaced.toLowerCase().split(/\s+/).filter(Boolean));
}
const STOPWORDS = new Set(["a", "an", "the", "this", "that", "of", "to", "for", "is", "are", "gets", "returns"]);

/** True when every content word of the summary is already in the name. */
function restates(name: unknown, summary: string): boolean {
  if (typeof name !== "string") return false;
  const tokens = identifierTokens(name);
  const words = (summary.toLowerCase().match(/[a-z0-9]+/g) ?? []).filter((w) => !STOPWORDS.has(w));
  if (words.length === 0) return false;
  return words.every((w) => tokens.has(w) || tokens.has(w.replace(/s$/, "")) || tokens.has(w + "s"));
}

/** A JSDoc whose only prose re-spells the name it documents. */
const jsdocNotRestating = U.Comment({
  kind: "jsdoc",
  summary: $("summary"),
  body: [],
  tags: $("tags"),
  attachedTo: DECLARATION,
})
  .when(({ name, summary, tags }) => !tags.some((t) => t.text.includes("\n")) && restates(name, summary.join(" ")))
  .message("this JSDoc restates the name; say what a reader cannot derive, or delete it");

/** Comments stay ASCII. */
const noUnicodeComment = U.Comment({ text: /[^\x00-\x7f]/ }).message("non-ASCII character in a comment: spell it in ASCII");

type Report = { line: number; column: number; endLine?: number; endColumn?: number; message: string };

function lint(rule: unknown, code: string): Report[] {
  const linter = new Linter();
  const messages = linter.verify(
    code,
    {
      files: ["**/*.ts"],
      languageOptions: {
        parser: { parse: (text: string) => parse(text, { comment: true, tokens: true, loc: true, range: true }) },
      },
      plugins: { t: { rules: { r: createRule(rule as never) as never } } },
      rules: { "t/r": "error" },
      linterOptions: { reportUnusedDisableDirectives: "off" },
    },
    "a.ts",
  );
  return messages.map(({ line, column, endLine, endColumn, message }) => ({ line, column, endLine, endColumn, message }));
}

const valid = (rule: unknown, codes: string[]) => {
  for (const code of codes) expect({ code, reports: lint(rule, code) }).toEqual({ code, reports: [] });
};
const invalid = (rule: unknown, codes: string[]) => {
  for (const code of codes) expect({ code, n: lint(rule, code).length }).toEqual({ code, n: 1 });
};

describe("createRule over U.Comment", () => {
  it("reports at the comment's own location", () => {
    expect(lint(noInlineComments, "const a = 1; // trailing\nconst b = 2;")).toEqual([
      { line: 1, column: 14, endLine: 1, endColumn: 25, message: expect.stringContaining("wants a name") },
    ]);
  });

  it("no-inline-comments", () => {
    valid(noInlineComments, [
      "// Copyright 2026 Example Corp. MIT License.\nconst a = 1;",
      "// eslint-disable-next-line no-console\nconsole.log(1);",
      "// oxlint-disable-next-line no-explicit-any -- the SDK types it so\nlet x: any;",
      "/* eslint no-console: off */\nconsole.log(1);",
      "// @ts-expect-error wrong lib types\nfoo();",
      "// prettier-ignore\nconst m = [1, 0, 0, 1];",
      "/** A handler. */\nexport const onEvent = () => {};",
      "/** Shape of a row. */\ntype Row = { a: 1 };",
      "class A {\n  /** The count. */\n  n = 0;\n  /** Bumps it. */\n  bump() {}\n}",
      "enum E {\n  /** first */\n  A,\n}",
      "interface I {\n  /** width in cells */\n  w: number;\n}",
      "const o = {\n  /** hook name */\n  name: 'x',\n};",
    ]);
    invalid(noInlineComments, [
      "// why this is here\nconst a = 1;",
      "const a = 1; // trailing\n",
      "/* block */\nconst a = 1;",
      "const a = 1;\n// Copyright late in the file\nconst b = 2;",
      "/** floating */\nfoo();",
      "function f() {\n  /** inside */\n  return 1;\n}",
      "const y = x as string; // -- the field is validated upstream",
    ]);
  });

  it("jsdoc-shape", () => {
    valid(jsdocShape, [
      "/** One line. */\nfunction f() {}",
      "/**\n * Two\n * lines.\n */\nfunction f() {}",
      "/**\n * Summary.\n *\n * Body one.\n * Body two.\n * Body three.\n * @param a the a\n * @returns b\n */\nfunction f(a) {}",
      "/**\n * Summary.\n * @example\n * f(1)\n */\nfunction f(a) {}",
      "// not jsdoc\nconst a = 1;",
    ]);
    invalid(jsdocShape, [
      "/**\n * One\n * two\n * three.\n */\nfunction f() {}",
      "/**\n * S.\n *\n * a\n * b\n * c\n * d\n */\nfunction f() {}",
      "/**\n * S.\n *\n * a\n *\n * b\n */\nfunction f() {}",
      "/**\n * S.\n * @param a one\n * two\n * three\n */\nfunction f(a) {}",
      "/**\n * S.\n * @returns r\n *\n * after\n */\nfunction f() {}",
    ]);
  });

  it("jsdoc-line-width", () => {
    const word = "x".repeat(70);
    valid(jsdocLineWidth, [
      `/**\n * ${"y".repeat(77)}\n */\nfunction f() {}`,
      `  /** ${"y".repeat(70)} */\n  function f() {}`,
      `// ${word}${word}\nfunction f() {}`,
    ]);
    invalid(jsdocLineWidth, [
      `/**\n * ${"y".repeat(78)}\n */\nfunction f() {}`,
      `    /** ${"y".repeat(72)} */\n    function f() {}`,
      `/** ${word}xxxxxxx\n * short\n */\nfunction f() {}`,
    ]);
  });

  it("jsdoc-not-restating", () => {
    valid(jsdocNotRestating, [
      "/** Rejects a header whose magic number is wrong. */\nfunction parseHeader() {}",
      "/** Cached per process; cleared on SIGHUP. */\nexport const userName = '';",
      "/** The count. */\nfoo();",
      "/**\n * Loads config.\n *\n * Reads from disk once.\n */\nfunction loadConfig() {}",
      "/**\n * Loads config.\n * @param x one\n *   and more\n */\nfunction loadConfig(x) {}",
    ]);
    invalid(jsdocNotRestating, [
      "/** Gets the user name. */\nfunction getUserName() {}",
      "/** Parse header. */\nexport function parseHeader() {}",
      "class A {\n  /** The on event handler. */\n  onEventHandler() {}\n}",
      "/** Max retries */\nconst MAX_RETRIES = 3;",
      "/** Max retries */\nexport default class MaxRetries {}",
    ]);
  });

  it("no-unicode in comments", () => {
    valid(noUnicodeComment, ["// plain ascii comment\nconst a = 1;", "const s = 'café';"]);
    invalid(noUnicodeComment, ["// arrow → here\nconst a = 1;", "/** box ── art */\nconst a = 1;"]);
  });
});
