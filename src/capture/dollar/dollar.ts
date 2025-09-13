import type { Capture } from "../capture-type";
import { CAPTURE_BRAND } from "../capture-type";

/**
 * Creates a capture sentinel with a literal-typed name.
 *
 * @example
 * const pattern = { userId: $("id"), userName: $("name") };
 *
 * @param name - Unique identifier for this capture
 */
export const $ = <const Name extends string>(name: Name): Capture<Name> =>
  Object.freeze({
    [CAPTURE_BRAND]: true,
    name,
  } as Capture<Name>);
