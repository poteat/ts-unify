# rewrite-alias-imports

## Purpose

`tsc --emitDeclarationOnly` writes `@/x` import specifiers into `dist/**/*.d.ts`
exactly as the source spells them. The alias is defined only by this package's
own `tsconfig.json` (`"@/*": ["./src/*"]`), so a consumer resolving those
declarations finds no module at `@/ast`, the imported types become `any`, and
the public surface (`U`, `$`, `C`) loses its type. The build runs this script
last to rewrite every alias to the relative path of the same file under `dist`.

## Behaviour

- Walks `dist` for `.d.ts` files and rewrites `from "@/x"` and `import("@/x")`
  to a relative specifier computed from the file's own directory.
- Exits non-zero if any `"@/` specifier remains, so a new alias shape that the
  regex misses fails the build instead of shipping.
- Takes the dist directory as its only argument, defaulting to `dist`.

## Not covered

Runtime `.mjs` output: tsup bundles and resolves aliases itself, so only the
declarations need the rewrite.
