import type { BindCaptures, Capture, Spread } from "@/capture";
import { $ } from "@/capture";
import type { Pattern } from "@/pattern";
import { assertType } from "@/test-utils/assert-type";

describe("BindCaptures with Spread over arrays (type-level)", () => {
  it("binds head/rest/tail with element-type refinement", () => {
    type Shape = ReadonlyArray<string | number>;
    type Pattern = [Capture<"head">, Spread<"rest">, Capture<"tail">];
    type Result = BindCaptures<Pattern, Shape>;
    type Expected = readonly [
      Capture<"head", string | number>,
      Spread<"rest", string | number>,
      Capture<"tail", string | number>
    ];
    assertType<Result, Expected>(0);
  });

  it("intersects typed spread element with shape element type", () => {
    type Shape = ReadonlyArray<string | number>;
    type Pattern = [Spread<"xs", string>];
    type Result = BindCaptures<Pattern, Shape>;
    type Expected = readonly [Spread<"xs", string>];
    assertType<Result, Expected>(0);
  });

  it("supports multiple spreads (behavior DC, but typing refines element)", () => {
    type Shape = ReadonlyArray<boolean>;
    type Pattern = [Spread<"a">, "x", Spread<"b">];
    type Result = BindCaptures<Pattern, Shape>;
    type Expected = readonly [Spread<"a", boolean>, "x", Spread<"b", boolean>];
    assertType<Result, Expected>(0);
  });

  it("binds spread yielded by $ sugar", () => {
    const rest = $<"rest", string>("rest");
    const seq = [...rest]; // runtime sugar; element type is Spread<'rest', string>
    type Elem = (typeof seq)[number];
    type Shape = ReadonlyArray<string | number>;
    type Bound = BindCaptures<Elem, Shape>;
    type Expected = Spread<"rest", string>;
    assertType<Bound, Expected>(0);
  });

  it("builder accepts $, ...$('rest') and binds to value types", () => {
    type Shape = ReadonlyArray<string | number>;
    function build<const P extends Pattern<Shape>>(
      p: P
    ): BindCaptures<P, Shape> {
      void p;
      return 0 as any as BindCaptures<P, Shape>;
    }
    const bound = build([$, ...$("rest")]);
    type Bound = typeof bound;
    type Expected = readonly [
      Capture<"0", string | number>,
      ...Spread<"rest", string | number>[]
    ];
    assertType<Bound, Expected>(0);
  });
});
