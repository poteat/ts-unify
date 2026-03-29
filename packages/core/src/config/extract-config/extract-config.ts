import type { ConfigSlot } from "@/config/config-type";
import type { Prettify } from "@/type-utils";
import type { ExtractFromPattern } from "@/pattern/extract-from-pattern";

/** Extract config slot names and types from a pattern or output shape. */
export type ExtractConfig<Pattern> = Prettify<
  ExtractFromPattern<Pattern, ConfigSlot>
>;
