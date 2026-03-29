import { $ } from "@/capture";
import { U } from "@/ast";

/**
 * Normalize ternary expressions to have positive conditions first
 *
 * @example
 * ```ts
 * // Before
 * !condition ? consequent : alternate
 *
 * // After
 * condition ? alternate : consequent
 * ```
 *
 * @example
 * ```ts
 * // Before
 * x !== y ? consequent : alternate
 *
 * // After
 * x === y ? alternate : consequent
 * ```
 *
 * @example
 * ```ts
 * // Before
 * x != y ? consequent : alternate
 *
 * // After
 * x == y ? alternate : consequent
 * ```
 */

const negatedTernary = U.ConditionalExpression({
  test: U.UnaryExpression({ operator: "!", argument: $("condition") }),
  ...$,
});

const inequalityTernary = U.ConditionalExpression({
  test: U.BinaryExpression($),
  ...$,
}).when(({ operator }) => operator === "!=" || operator === "!==");

export const normalizeTernaryOrder = U.or(negatedTernary, inequalityTernary)
  .with(({ consequent: alternate, alternate: consequent }) => ({
    consequent,
    alternate,
  }))
  .with((bag) => ({ test: U.BinaryExpression(bag) }))
  .to((bag) => U.ConditionalExpression(bag));
