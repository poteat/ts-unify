import type { BuilderMap } from "@/ast";
import { $ } from "@/capture";
import type { OR_BRAND } from "@/ast/or";
import { assertType } from "@/test-utils/assert-type";

describe("BuilderUtilities.maybeBlock (type-level)", () => {
  it("matches both block and non-block forms and preserves captures", () => {
    function check(u: BuilderMap) {
      const ret = u.ReturnStatement({ argument: $("value") });
      const mb = u.maybeBlock(ret);
      type Brand = (typeof mb)[typeof OR_BRAND];
      assertType<Brand, true>(0);
    }
    void check;
  });
});
