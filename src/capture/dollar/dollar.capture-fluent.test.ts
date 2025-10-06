import type { FluentCapture } from "@/capture/fluent-capture";
import type { Capture } from "@/capture";
import { assertType } from "@/test-utils/assert-type/assert-type";

describe("Capture-local fluent on $(name)", () => {
  it("map replaces the capture value type (normalized) after binding", () => {
    function check(capture: FluentCapture<"x", number>) {
      const c = capture.map((n: number) => n.toString());
      type Bound = import("@/capture").BindCaptures<typeof c, number>;
      type V = Bound extends { value?: infer T } ? T : never;
      assertType<V, string>(0);
    }
    void check;
  });

  it("default substitutes to the fallback type (not a union)", () => {
    function check(capture: FluentCapture<"y", string>) {
      const c = capture.default(123 as const);
      type Bound = import("@/capture").BindCaptures<typeof c, string>;
      type V = Bound extends { value?: infer T } ? T : never;
      assertType<V, 123>(0);
    }
    void check;
  });

  it("defaultUndefined substitutes to Identifier type after binding", () => {
    function check(capture: FluentCapture<"z", string>) {
      const c = capture.defaultUndefined();
      type Bound = import("@/capture").BindCaptures<typeof c, string>;
      type V = Bound extends { value?: infer T } ? T : never;
      // Using Identifier("undefined") sugar → value type is Identifier
      assertType<V, import("@typescript-eslint/types").TSESTree.Identifier>(0);
    }
    void check;
  });

  it("truthy narrows out falsy constituents after binding", () => {
    function check(capture: FluentCapture<"t", string | "" | 0 | null>) {
      const c = capture.truthy();
      type Bound = import("@/capture").BindCaptures<
        typeof c,
        string | "" | 0 | null
      >;
      type V = Bound extends { value?: infer T } ? T : never;
      assertType<V, string>(0);
    }
    void check;
  });

  it("when(guard) narrows to the guarded subtype after binding", () => {
    function check(capture: FluentCapture<"a", string | null>) {
      const notNull: (x: string | null) => x is string = null as any;
      const c = capture.when(notNull);
      type Bound = import("@/capture").BindCaptures<typeof c, string | null>;
      type V = Bound extends { value?: infer T } ? T : never;
      assertType<V, string>(0);
    }
    void check;
  });

  it("when(boolean) leaves the type unchanged after binding", () => {
    function check(capture: FluentCapture<"b", string | null>) {
      const pred: (x: string | null) => boolean = null as any;
      const c = capture.when(pred);
      type Bound = import("@/capture").BindCaptures<typeof c, string | null>;
      type V = Bound extends { value?: infer T } ? T : never;
      assertType<V, string | null>(0);
    }
    void check;
  });

  it("methods are chainable", () => {
    function check(capture: FluentCapture<"c", string | "">) {
      const notEmpty: (s: string) => s is `${string}${string}` = null as any;
      const c = capture.default("x").truthy().when(notEmpty);
      type V = typeof c extends { value?: infer T } ? T : never;
      // After default + truthy + when, we still have string
      assertType<V, string>(0);
    }
    void check;
  });

  it("still conforms to Capture<Name, Value>", () => {
    function check(c: FluentCapture<"k", number>) {
      const assign: Capture<"k", number> = c;
      void assign;
    }
    void check;
  });
});
