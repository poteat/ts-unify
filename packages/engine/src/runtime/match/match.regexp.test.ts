import { U, $ } from "@ts-unify/core";
import { match } from "./match";

describe("match - RegExp", () => {
  it("tests a string position against the RegExp", () => {
    expect(match({ type: "Identifier", name: "fooBar" }, U.Identifier({ name: /^foo/ }))).toEqual({});
    expect(match({ type: "Identifier", name: "bar" }, U.Identifier({ name: /^foo/ }))).toBeNull();
  });

  it("never matches a non-string", () => {
    expect(match({ type: "Literal", value: 42 }, U.Literal({ value: /4/ }))).toBeNull();
  });

  it("works in sequence positions and beside captures", () => {
    const node = {
      type: "CallExpression",
      callee: { type: "Identifier", name: "log" },
      arguments: [{ type: "Literal", value: "hello" }],
    };
    const bag = match(node, U.CallExpression({ callee: U.Identifier({ name: /^(log|warn)$/ }), arguments: [U.Literal({ value: $("v") })] }));
    expect(bag).toEqual({ v: "hello" });
  });

  it("resets a global RegExp between tests", () => {
    const re = /a/g;
    const p = U.Identifier({ name: re });
    expect(match({ type: "Identifier", name: "a" }, p)).toEqual({});
    expect(match({ type: "Identifier", name: "a" }, p)).toEqual({});
  });
});
