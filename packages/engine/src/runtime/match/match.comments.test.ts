import { parse } from "@typescript-eslint/typescript-estree";
import { U, $ } from "@ts-unify/core";
import { match } from "./match";
import { commentNodes } from "../comment-nodes";

const program = (code: string) =>
  parse(code, { comment: true, tokens: true, loc: true, range: true });

describe("match - comments", () => {
  it("matches a Comment node directly, with captures on its fields", () => {
    const [c] = commentNodes(program("// todo later\nx;"));
    const bag = match(c, U.Comment({ kind: "line", text: $("text") }));
    expect(bag).toEqual({ text: " todo later" });
    expect(match(c, U.Comment({ kind: "block" }))).toBeNull();
  });

  it("matches raw comments under Program.comments through their node view", () => {
    const ast = program("/** header */\n// a\nexport const x = 1;");
    const bag = match(ast, U.Program({ comments: [U.Comment({ kind: "jsdoc", text: $("h") }), ...$("rest")] }));
    expect(bag).not.toBeNull();
    expect(bag!.h).toBe("header");
    expect(bag!.rest).toHaveLength(1);
  });

  it("finds a comment anywhere in the list with two spreads", () => {
    const ast = program("// a\n/* b */\n// c\nx;");
    const bag = match(ast, U.Program({ comments: [...$, U.Comment({ kind: "block", text: $("b") }), ...$] }));
    expect(bag!.b).toBe(" b ");
  });

  it("does not match a raw comment against U.Comment outside a Program match", () => {
    const ast = program("// a\nx;");
    expect(match(ast.comments[0], U.Comment())).toBeNull();
  });

  it("reads the attached declaration through a nested pattern", () => {
    const ast = program("/** Adds. */\nfunction add() {}");
    const [c] = commentNodes(ast);
    const bag = match(
      c,
      U.Comment({
        kind: "jsdoc",
        summary: $("summary"),
        attachedTo: U.FunctionDeclaration({ id: U.Identifier({ name: $("name") }) }),
      }),
    );
    expect(bag).toMatchObject({ name: "add", summary: ["Adds."] });
  });

  it("counts summary lines with a sequence pattern", () => {
    const long = commentNodes(program("/**\n * one\n * two\n * three\n */\nx;"))[0];
    const short = commentNodes(program("/** one */\nx;"))[0];
    const threeOrMore = U.Comment({ kind: "jsdoc", summary: [$, $, $, ...$] });
    expect(match(long, threeOrMore)).not.toBeNull();
    expect(match(short, threeOrMore)).toBeNull();
  });

  it("matches a null attachedTo literally", () => {
    const ast = program("function f() {\n  /** floating */\n}\n/** doc */\nconst a = 1;");
    const [floating, doc] = commentNodes(ast);
    const detached = U.Comment({ kind: "jsdoc", attachedTo: null });
    expect(match(floating, detached)).toEqual({});
    expect(match(doc, detached)).toBeNull();
  });
});
