import { U, $ } from "@ts-unify/core";
import { createPlugin } from "./create-plugin";

// Cast through `any` -- see note in create-rule.test.ts.
const idPattern = U.Identifier({ name: $("n") }) as any;
const ifPattern = U.IfStatement({ test: $("cond") }) as any;

describe("createPlugin", () => {
  it("returns an object with a rules property", () => {
    const plugin = createPlugin({});
    expect(plugin).toHaveProperty("rules");
    expect(typeof plugin.rules).toBe("object");
  });

  it("uses unqualified rule names in the rules object", () => {
    const plugin = createPlugin({ "my-rule": idPattern });
    expect(plugin.rules).toHaveProperty("my-rule");
    expect(plugin.rules).not.toHaveProperty("ts-unify/my-rule");
  });

  it("uses qualified names in the recommended config", () => {
    const plugin = createPlugin({ "my-rule": idPattern });
    // idPattern isn't recommended, so it won't be in recommended rules
    expect(plugin.configs.recommended.rules).not.toHaveProperty("ts-unify/my-rule");
  });

  it("creates a valid RuleModule for each entry", () => {
    const plugin = createPlugin({
      "find-id": idPattern,
      "find-if": ifPattern,
    });

    const findId = plugin.rules["find-id"];
    const findIf = plugin.rules["find-if"];

    expect(findId.meta.type).toBe("suggestion");
    expect(findIf.meta.type).toBe("suggestion");
    expect(typeof findId.create).toBe("function");
    expect(typeof findIf.create).toBe("function");
  });

  it("sets the message to 'ts-unify: <name>' for each rule", () => {
    const plugin = createPlugin({ "my-rule": idPattern });
    const rule = plugin.rules["my-rule"];
    expect(rule.meta.messages.match).toBe("ts-unify: my-rule");
  });

  it("handles an empty rules map", () => {
    const plugin = createPlugin({});
    expect(Object.keys(plugin.rules)).toHaveLength(0);
  });
});
