import { SPREAD_BRAND } from "./spread";
import { $ } from "@/capture";

describe("Spread token", () => {
  it("exports a brand symbol", () => {
    expect(typeof SPREAD_BRAND).toBe("symbol");
  });

  it("$ spread sugar yields exactly one token at runtime", () => {
    const rest = $<"rest", number>("rest");
    const tokens = [...rest];
    expect(Array.isArray(tokens)).toBe(true);
    expect(tokens).toHaveLength(1);
  });
});
