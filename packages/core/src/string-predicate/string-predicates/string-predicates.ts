import { not, regex } from "@/string-predicate/string-predicate";
import { reserved } from "@/string-predicate/reserved";
import { identifierName } from "@/string-predicate/identifier-name";

/**
 * The string predicates, exposed as `U.string`. Each is usable in a string
 * position of a pattern and callable on a captured value.
 */
export const stringPredicates = { regex, not, reserved, identifierName } as const;

export type StringPredicates = typeof stringPredicates;
