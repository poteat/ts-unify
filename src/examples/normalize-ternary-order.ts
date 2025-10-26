import type { BuilderMap } from "@/ast";
import { $ } from "@/capture";

declare const U: BuilderMap;

/**
 * Normalize ternary expressions to have positive conditions first
 *
 * Transforms:
 *   !condition ? consequent : alternate
 * Into:
 *   condition ? alternate : consequent
 *
 * Also transforms:
 *   x !== y ? consequent : alternate
 * Into:
 *   x === y ? alternate : consequent
 *
 * And:
 *   x != y ? consequent : alternate
 * Into:
 *   x == y ? alternate : consequent
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
