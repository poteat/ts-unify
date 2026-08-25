# Wired

`Wired<R>` is the rest parameter type of `wire`: `R` when `Missing<R>` is
`never`, else `readonly MissingDeps<Missing<R>>[]`. TypeScript still infers
`R` from the arguments through the conditional, and when the tuple is
incomplete the first argument fails against `MissingDeps`, naming what is
missing.
