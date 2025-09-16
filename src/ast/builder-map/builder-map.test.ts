import type { BuilderMap } from "./builder-map";
import type { NodeKind, PatternBuilder } from "@/ast";
import { assertType } from "@/test-utils/assert-type";

describe("BuilderMap", () => {
  it("maps kinds to pattern builders", () => {
    type U = BuilderMap;
    type IfBuilder = U["IfStatement" & NodeKind];
    assertType<IfBuilder, PatternBuilder<"IfStatement" & NodeKind>>(0);
  });
});
