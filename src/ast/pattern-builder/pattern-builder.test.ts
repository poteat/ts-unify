import type { PatternBuilder, NodeKind, NodeByKind } from "@/ast";
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
});
