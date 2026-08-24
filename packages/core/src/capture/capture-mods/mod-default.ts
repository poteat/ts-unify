/**
 * Modifier recorded by `.default()`: a falsy captured value becomes `Expr`.
 *
 * @typeParam Expr type of the fallback expression
 */
export type ModDefault<Expr> = { default: Expr }
