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

  it("converts camelCase export names to kebab-case rule names", () => {
    const plugin = createPlugin({ myFancyRule: idPattern });
    expect(plugin.rules).toHaveProperty("my-fancy-rule");
    expect(plugin.rules).not.toHaveProperty("myFancyRule");
  });

  it("preserves already-kebab names", () => {
    const plugin = createPlugin({ "my-rule": idPattern });
    expect(plugin.rules).toHaveProperty("my-rule");
  });

  it("uses qualified kebab names in the recommended config", () => {
    const plugin = createPlugin({ "my-rule": idPattern });
    expect(plugin.configs.recommended.rules).not.toHaveProperty("ts-unify/my-rule");
  });

  it("creates a valid RuleModule for each entry", () => {
    const plugin = createPlugin({
      findId: idPattern,
      findIf: ifPattern,
    });

    const findId = plugin.rules["find-id"];
    const findIf = plugin.rules["find-if"];

    expect(findId.meta.type).toBe("suggestion");
    expect(findIf.meta.type).toBe("suggestion");
    expect(typeof findId.create).toBe("function");
    expect(typeof findIf.create).toBe("function");
  });

  it("uses default message when rule has no .message()", () => {
    const plugin = createPlugin({ myRule: idPattern });
    const rule = plugin.rules["my-rule"];
    expect(rule.meta.messages.match).toBe("Matches a ts-unify pattern");
  });

  it("handles an empty rules map", () => {
    const plugin = createPlugin({});
    expect(Object.keys(plugin.rules)).toHaveLength(0);
  });
});
