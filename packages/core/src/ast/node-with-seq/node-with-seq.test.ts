import type { ExtractCaptures } from "@/pattern";
import type { Capture } from "@/capture";
import { assertType } from "@/test-utils/assert-type/assert-type";
import { U } from "@/ast";
import { $ } from "@/capture";
import type { SEQ_BRAND } from "@/ast/seq-brand";

describe("NodeWithSeq (type-level)", () => {
  it("extracts from raw captures in seq", () => {
    type RawSeq = { readonly [SEQ_BRAND]: [Capture<"a", number>, Capture<"b", string>] };
    type Bag = ExtractCaptures<RawSeq>;
    assertType<keyof Bag, "a" | "b">(0);
  });

  it("U.seq() carries SEQ_BRAND", () => {
    const s = U.seq($("x"), $("y"));
    type HasBrand = typeof s extends { readonly [SEQ_BRAND]: unknown } ? true : false;
    const _: HasBrand = true;
    void _;
  });

  it("extracts typed captures from U.seq with FluentNode elements", () => {
    const s = U.seq(
      U.ReturnStatement({ argument: $("arg") }),
      $("next"),
    );
    type Bag = ExtractCaptures<typeof s>;
    assertType<keyof Bag, "arg" | "next">(0);
  });

  it("seq inside BlockStatement propagates captures to parent", () => {
    const pattern = U.BlockStatement({
      body: [
        ...$("before"),
        U.seq(
          U.ReturnStatement({ argument: $("x") }),
          $("y"),
        ),
        ...$("after"),
      ],
    });
    type Bag = ExtractCaptures<typeof pattern>;
    assertType<keyof Bag, "before" | "after" | "x" | "y">(0);
  });

  it(".to() callback receives the typed bag — compiles without annotations", () => {
    U.seq(
      U.VariableDeclaration({
        kind: "const",
        declarations: [U.VariableDeclarator({ id: $("id"), init: $("init") })],
      }),
      $("stmt"),
    ).to((bag) => {
      // If the bag were Record<string, unknown>, this destructure would fail.
      const { id, init, stmt } = bag;
      void id; void init; void stmt;
      return null;
    });
  });

  it("seq with .to() inside BlockStatement still propagates captures to .when()", () => {
    const seqRewrite = U.seq(
      U.VariableDeclaration({
        kind: "const",
        declarations: [U.VariableDeclarator({ id: $("id"), init: $("init") })],
      }),
      $("stmt"),
    ).to((bag) => { void bag; return null; });

    const pattern = U.BlockStatement({
      body: [...$("before"), seqRewrite, ...$("after")],
    });

    type Bag = ExtractCaptures<typeof pattern>;
    assertType<keyof Bag, "before" | "after" | "id" | "init" | "stmt">(0);
  });
});
