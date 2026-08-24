import type { PatternBuilder, NodeKind, NodeByKind } from "@/ast";
import type { BuilderMap } from "@/ast";
import type { ExtractCaptures } from "@/pattern";
import type { TSESTree } from "@typescript-eslint/types";
import { $ } from "@/capture";
import { assertType } from "@/test-utils/assert-type";

describe("PatternBuilder", () => {
  it("nullary form returns discriminant only", () => {
    type B = PatternBuilder<"BlockStatement" & NodeKind>;
    type HasNullary<T> = T extends {
      (): { type: NodeByKind["BlockStatement"]["type"] };
    }
      ? true
      : false;
    assertType<HasNullary<B>, true>(0);
  });

  it("binds loc on a Comment pattern, and not on other kinds", () => {
    function check(u: BuilderMap) {
      const c = u.Comment({ lines: $("lines"), loc: $("loc") });
      type CBag = ExtractCaptures<typeof c>;
      assertType<CBag["loc"], TSESTree.SourceLocation>(0);
      assertType<CBag["lines"], string[]>(0);
      const i = u.Identifier({ loc: $("loc") });
      type IBag = ExtractCaptures<typeof i>;
      assertType<IBag["loc"], unknown>(0);
    }
    void check;
  });
});
