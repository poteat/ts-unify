import { Linter } from "eslint";
import { parse } from "@typescript-eslint/typescript-estree";
import { U, $ } from "@ts-unify/core";
import { createRule } from "./create-rule";

// A destructuring property that renames a key which could have been the
// binding: `{ key: name }` where `key` is an IdentifierName and not reserved.
// The predicate sits on the capture over the `U.or`, once for both spellings
// of the key, and the guard types `key` as a string in the bag.
const renamedKey = U.Property({
  computed: false,
  shorthand: false,
  key: U.or(U.Identifier({ name: $("key") }), U.Literal({ value: $("key") })).when(
    (bag: { key: unknown }): bag is { key: string } =>
      U.string.identifierName()(bag.key) && !U.string.reserved()(bag.key),
  ),
  value: U.Identifier({ name: $("name") }),
}).message("{{key}} renamed to {{name}}");

// Slot form, for a slot with nothing to capture.
const reservedName = U.Identifier({ name: U.string.reserved({ typescript: true }) }).message("reserved");

function lint(rule: unknown, code: string): string[] {
  const linter = new Linter();
  return linter
    .verify(
      code,
      {
        files: ["**/*.ts"],
        languageOptions: {
          parser: { parse: (text: string) => parse(text, { comment: true, tokens: true, loc: true, range: true }) },
        },
        plugins: { t: { rules: { r: createRule(rule as never) as never } } },
        rules: { "t/r": "error" },
      },
      "a.ts",
    )
    .map((m) => m.message);
}

describe("createRule with string predicates", () => {
  it("applies a .when over a U.or capture once, for either spelling of the key", () => {
    expect(lint(renamedKey, "const { a: b } = o;")).toEqual(["a renamed to b"]);
    expect(lint(renamedKey, "const { 'a': b } = o;")).toEqual(["a renamed to b"]);
    expect(lint(renamedKey, "const { class: b } = o;")).toEqual([]);
    expect(lint(renamedKey, "const { 'data-id': b } = o;")).toEqual([]);
    expect(lint(renamedKey, "const { 1: b } = o;")).toEqual([]);
    expect(lint(renamedKey, "const { a } = o;")).toEqual([]);
  });

  it("tests a slot with a predicate the way it does with a RegExp", () => {
    expect(lint(reservedName, "o.type;")).toEqual(["reserved"]);
    expect(lint(reservedName, "o.kind;")).toEqual([]);
    expect(lint(U.Identifier({ name: /^ki/ }).message("re"), "o.kind;")).toEqual(["re"]);
  });
});
