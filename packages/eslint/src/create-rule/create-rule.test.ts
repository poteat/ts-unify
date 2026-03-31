import { U, $, C } from "@ts-unify/core";
import { createRule } from "./create-rule";

// The fluent builder returns a Proxy whose static type (FluentNode) does not
// structurally satisfy TransformLike, even though the runtime value does.
// We cast through `any` to keep the tests focused on runtime behaviour.
const id = U.Identifier({ name: $("n") }) as any;
const ifStmt = U.IfStatement({ test: $("cond") }) as any;

describe("createRule", () => {
  it("returns a RuleModule with meta.type = 'suggestion'", () => {
    const rule = createRule(id);
    expect(rule.meta.type).toBe("suggestion");
  });

  it("uses the default message when none is provided", () => {
    const rule = createRule(id);
    expect(rule.meta.messages.match).toBe("Matches a ts-unify pattern");
  });

  it("uses a custom message when provided", () => {
    const rule = createRule(id, { message: "Custom message" });
    expect(rule.meta.messages.match).toBe("Custom message");
  });

  it("does not set meta.fixable when fix is not enabled", () => {
    const rule = createRule(id);
    expect(rule.meta.fixable).toBeUndefined();
  });

  it("sets meta.fixable to 'code' when fix is enabled and .to() is present", () => {
    const transform = (U.Identifier({ name: $("n") }) as any).to(() => ({
      type: "Identifier",
      name: "replaced",
    }));
    const rule = createRule(transform, { fix: true });
    expect(rule.meta.fixable).toBe("code");
  });

  it("creates a visitor for the correct AST node type", () => {
    const rule = createRule(ifStmt);
    const visitors = rule.create({ report() {} } as any);
    expect(visitors).toHaveProperty("IfStatement");
    expect(typeof visitors.IfStatement).toBe("function");
  });

  it("visitor calls context.report when a node matches", () => {
    const rule = createRule(id, { message: "Found {{n}}" });

    const reported: any[] = [];
    const visitors = rule.create({
      report(descriptor: any) {
        reported.push(descriptor);
      },
    } as any);

    const fakeNode = { type: "Identifier", name: "foo" };
    visitors.Identifier(fakeNode as any);

    expect(reported).toHaveLength(1);
    expect(reported[0].messageId).toBe("match");
    expect(reported[0].data).toEqual({ n: "foo" });
  });

  it("visitor does not report when a node does not match", () => {
    // Pattern requires name === "specific" (literal), so other names won't match.
    const rule = createRule(
      U.Identifier({ name: "specific" }) as any
    );

    const reported: any[] = [];
    const visitors = rule.create({
      report(descriptor: any) {
        reported.push(descriptor);
      },
    } as any);

    const fakeNode = { type: "Identifier", name: "other" };
    visitors.Identifier(fakeNode as any);

    expect(reported).toHaveLength(0);
  });

  it("resolves config slots in imports from the chain config defaults", () => {
    // Build a transform that has .imports() and .config() on the chain
    const transform = (U.ArrayExpression({
      elements: [$("arr")],
    }) as any)
      .to(({ arr }: { arr: any }) =>
        U.CallExpression({
          callee: U.Identifier({ name: "uniq" }),
          arguments: [arr],
        })
      )
      .imports({ uniq: C("from") })
      .config({ from: "lodash" });

    const rule = createRule(transform, { fix: true });
    expect(rule.meta.fixable).toBe("code");

    // Verify the fix function produces import statements
    const reported: any[] = [];
    const fakeNode = {
      type: "ArrayExpression",
      elements: [{ type: "Identifier", name: "myArr" }],
      range: [10, 25],
    };

    const fixes: any[] = [];
    const fakeFixer = {
      replaceText: (node: any, text: string) => ({
        range: node.range,
        text,
      }),
      insertTextBeforeRange: (range: [number, number], text: string) => ({
        range,
        text,
      }),
    };

    const visitors = rule.create({
      sourceCode: {
        getText: () => "const x = [myArr];",
      },
      report(descriptor: any) {
        reported.push(descriptor);
        if (descriptor.fix) {
          fixes.push(descriptor.fix(fakeFixer));
        }
      },
    } as any);

    visitors.ArrayExpression(fakeNode as any);

    expect(reported).toHaveLength(1);
    expect(fixes).toHaveLength(1);
    // Fix should be an array with two entries: import insertion + node replacement
    const fix = fixes[0];
    expect(Array.isArray(fix)).toBe(true);
    expect(fix).toHaveLength(2);
    expect(fix[0].range).toEqual([0, 0]);
    expect(fix[0].text).toContain('import { uniq } from "lodash"');
  });

  it("does not add imports when they already exist in the source", () => {
    const transform = (U.Identifier({
      name: $("n"),
    }) as any)
      .to(() => U.Identifier({ name: "replaced" }))
      .imports({ uniq: "lodash" })
      .config({});

    const rule = createRule(transform, { fix: true });

    const reported: any[] = [];
    const fixes: any[] = [];
    const fakeNode = {
      type: "Identifier",
      name: "foo",
      range: [30, 33],
    };

    const fakeFixer = {
      replaceText: (node: any, text: string) => ({
        range: node.range,
        text,
      }),
      insertTextBeforeRange: (range: [number, number], text: string) => ({
        range,
        text,
      }),
    };

    const visitors = rule.create({
      sourceCode: {
        getText: () =>
          'import { uniq } from "lodash";\nconst x = foo;',
      },
      report(descriptor: any) {
        reported.push(descriptor);
        if (descriptor.fix) {
          fixes.push(descriptor.fix(fakeFixer));
        }
      },
    } as any);

    visitors.Identifier(fakeNode as any);

    expect(reported).toHaveLength(1);
    // Fix should be a single RuleFix (not an array), because import already exists
    const fix = fixes[0];
    expect(Array.isArray(fix)).toBe(false);
  });
});
