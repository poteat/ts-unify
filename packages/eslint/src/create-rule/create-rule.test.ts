import { U, $ } from "@ts-unify/core";
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
});
