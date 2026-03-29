import type { DollarObjectSpread, Spread } from "@/capture";
import { $ } from "@/capture";
import { assertType } from "@/test-utils/assert-type";

describe("$ object/sequence spread semantics", () => {
  it("typeof $ carries the DollarObjectSpread brand (type-level)", () => {
    type HasBrand = typeof $ extends DollarObjectSpread ? true : false;
    assertType<HasBrand, true>(0);
  });

  it("typeof $ is iterable over anonymous Spread tokens (type-level)", () => {
    type IterOK = typeof $ extends Iterable<Spread<"", unknown>> ? true : false;
    assertType<IterOK, true>(0);
  });

  it("spread in object context produces no runtime props", () => {
    expect({ ...$ }).toEqual({});
  });

  it("spreading $ in sequences yields a single item at runtime", () => {
    const seq = [...$];
    expect(Array.isArray(seq)).toBe(true);
    expect(seq.length).toBe(1);
  });
});
