import { symGet } from "./sym-get";

describe("symGet", () => {
  it("retrieves a symbol-keyed property", () => {
    const sym = Symbol("test");
    const obj = { [sym]: 42 };
    expect(symGet(obj, sym)).toBe(42);
  });

  it("returns undefined when the symbol key is absent", () => {
    const sym = Symbol("missing");
    const obj = { other: 1 };
    expect(symGet(obj, sym)).toBeUndefined();
  });

  it("works with Symbol.for keys", () => {
    const sym = Symbol.for("shared");
    const obj = { [sym]: "hello" };
    expect(symGet(obj, sym)).toBe("hello");
  });

  it("returns undefined for an empty object", () => {
    const sym = Symbol("any");
    expect(symGet({}, sym)).toBeUndefined();
  });
});
