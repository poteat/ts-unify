import { parse } from "@typescript-eslint/typescript-estree";
import { commentNodes, commentNodeOf } from "./comment-nodes";

const program = (code: string) =>
  parse(code, { comment: true, tokens: true, loc: true, range: true, jsx: false });

describe("commentNodes", () => {
  it("gives every comment a kind and its text without delimiters", () => {
    const ast = program("// a\n/* b */\n/** c */\nx;");
    const [line, block, jsdoc] = commentNodes(ast);
    expect(line).toMatchObject({ type: "Comment", kind: "line", text: " a", header: true });
    expect(block).toMatchObject({ kind: "block", text: " b ", header: false });
    expect(jsdoc).toMatchObject({ kind: "jsdoc", text: "c", header: false });
  });

  it("returns an empty list for a program without comments", () => {
    expect(commentNodes(program("x;"))).toEqual([]);
    expect(commentNodes(null)).toEqual([]);
  });

  it("is built once per program", () => {
    const ast = program("// a\nx;");
    expect(commentNodes(ast)).toBe(commentNodes(ast));
    expect(commentNodeOf(ast, ast.comments[0])).toBe(commentNodes(ast)[0]);
  });

  it("strips the leading star of every jsdoc line and the blank edges", () => {
    const ast = program("/**\n *\n * Summary line.\n *   indented\n *\n */\nx;");
    expect(commentNodes(ast)[0].text).toBe("Summary line.\n  indented");
  });

  it("splits a jsdoc into summary, body and tags", () => {
    const ast = program(
      [
        "/**",
        " * First line.",
        " * Second line.",
        " *",
        " * Body one.",
        " * Body two.",
        " * @param x the x",
        " *   continued",
        " * @returns y",
        " */",
        "function f(x) {}",
      ].join("\n"),
    );
    const [c] = commentNodes(ast);
    expect(c.summary).toEqual(["First line.", "Second line."]);
    expect(c.body).toEqual(["Body one.", "Body two."]);
    expect(c.tags).toEqual([
      { name: "@param", text: "x the x\ncontinued" },
      { name: "@returns", text: "y" },
    ]);
  });

  it("keeps blank lines inside the body and leaves the body empty when a tag ends the summary", () => {
    const withBlank = commentNodes(program("/**\n * S\n *\n * B1\n *\n * B2\n */\nx;"))[0];
    expect(withBlank.body).toEqual(["B1", "", "B2"]);
    const tagged = commentNodes(program("/**\n * S\n * @see x\n */\nx;"))[0];
    expect(tagged.summary).toEqual(["S"]);
    expect(tagged.body).toEqual([]);
    expect(tagged.tags).toEqual([{ name: "@see", text: "x" }]);
  });

  it("keeps the source lines as written", () => {
    const ast = program("  /**\n   * Summary.\n   */\n  x; // t");
    const [doc, trailing] = commentNodes(ast);
    expect(doc.lines).toEqual(["/**", "   * Summary.", "   */"]);
    expect(doc.loc.start.column).toBe(2);
    expect(trailing.lines).toEqual(["// t"]);
  });

  it("leaves the jsdoc parts empty on line and block comments", () => {
    const [c] = commentNodes(program("/* not jsdoc */\nx;"));
    expect(c).toMatchObject({ kind: "block", summary: [], body: [], tags: [] });
  });

  it("attaches a comment to the outermost declaration at the next token", () => {
    const ast = program("/** doc */\nexport const a = 1;\n// inner\nfunction f() {}");
    const [doc, inner] = commentNodes(ast);
    expect(doc.attachedTo?.type).toBe("ExportNamedDeclaration");
    expect(inner.attachedTo?.type).toBe("FunctionDeclaration");
  });

  it("attaches class members, object properties and interface members", () => {
    const ast = program(
      "class A {\n  /** m */\n  m() {}\n  /** p */\n  p = 1;\n}\nconst o = {\n  /** k */\n  k: 1,\n};\ninterface I {\n  /** s */\n  s: number;\n}",
    );
    expect(commentNodes(ast).map((c) => c.attachedTo?.type)).toEqual([
      "MethodDefinition",
      "PropertyDefinition",
      "Property",
      "TSPropertySignature",
    ]);
  });

  it("attaches nothing when the next token starts no declaration", () => {
    const ast = program("function f() {\n  // trailing in body\n}\nfoo(); /* after call */\n// before a call\nbar();\n// last");
    expect(commentNodes(ast).map((c) => c.attachedTo)).toEqual([null, null, null, null]);
  });

  it("attaches nothing without tokens", () => {
    const ast = parse("/** doc */\nfunction f() {}", { comment: true, loc: true, range: true });
    expect(commentNodes(ast)[0].attachedTo).toBeNull();
  });

  it("marks only a first comment before all code as the header", () => {
    const header = (code: string) => commentNodes(program(code)).map((c) => c.header);
    expect(header("// a\n// b\nx;")).toEqual([true, false]);
    expect(header("x; // a\n// b")).toEqual([false, false]);
    expect(header("\n\n  /* a */ x;")).toEqual([true]);
    expect(header("// only")).toEqual([true]);
  });

  it("points loc and range at the comment itself", () => {
    const ast = program("x;\n  // here");
    const [c] = commentNodes(ast);
    expect(c.loc.start).toEqual({ line: 2, column: 2 });
    expect(c.range).toEqual([5, 12]);
    expect(c.parent).toBe(ast);
  });
});
