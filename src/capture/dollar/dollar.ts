import type { Capture } from "../capture-type";
import { CAPTURE_BRAND } from "../capture-type";

/**
 * Creates a capture sentinel with a literal-typed name.
 * When used without calling (just $), serves as implicit capture using the current key.
 *
 * @example
 * const pattern = { userId: $("id"), userName: $("name") };  // Explicit
 * const pattern2 = { name: $, age: $ };  // Implicit - uses key names
 *
 * @param name - Unique identifier for this capture (cannot be empty string)
 */
export const $ = <const Name extends string>(name: Name): Capture<Name> => {
  if (name === "") {
    throw new Error("Capture name cannot be empty string");
  }
  return Object.freeze({
    [CAPTURE_BRAND]: true,
    name,
  } as Capture<Name>);
};
