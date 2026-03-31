import { $ } from "@/capture";
import { U } from "@/ast";

const negatedTernary = U.ConditionalExpression({
  test: U.UnaryExpression({ operator: "!", argument: $("condition") }),
  ...$,
});

const inequalityTernary = U.ConditionalExpression({
  test: U.BinaryExpression($),
  ...$,
}).when(({ operator }) => operator === "!=" || operator === "!==");

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
const flipOp: Record<string, string> = { "!==": "===", "!=": "==" };

export const normalizeTernaryOrder = U.or(negatedTernary, inequalityTernary)
  .with(({ consequent: alternate, alternate: consequent }) => ({
    consequent,
    alternate,
  }))
  .with((bag: any) => ({
    test: bag.condition
      ? bag.condition
      : U.BinaryExpression({ operator: flipOp[bag.operator] ?? bag.operator, left: bag.left, right: bag.right } as any),
  }))
  .to((bag) => U.ConditionalExpression(bag));
