import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

/**
 * Rewrite `@/x` imports in emitted declarations to relative paths.
 * tsc emits the alias as written; a consumer has no `@/*` mapping.
 */
const dist = resolve(process.argv[2] ?? "dist");

const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith(".d.ts") ? [p] : [];
  });

const relativeTo = (file, target) => {
  const rel = relative(dirname(file), join(dist, target)).split("\\").join("/");
  return rel.startsWith(".") ? rel : `./${rel}`;
};

let rewritten = 0;
for (const file of walk(dist)) {
  const before = readFileSync(file, "utf8");
  const after = before.replace(/(from\s+|import\s*\(\s*)"@\/([^"]*)"/g, (_, lead, target) => {
    rewritten += 1;
    return `${lead}"${relativeTo(file, target)}"`;
  });
  if (after !== before) writeFileSync(file, after);
}
const leftover = walk(dist).filter((f) => /"@\//.test(readFileSync(f, "utf8")));
if (leftover.length) {
  console.error(`alias imports remain in: ${leftover.join(", ")}`);
  process.exit(1);
}
console.log(`rewrote ${rewritten} alias import(s) under ${relative(process.cwd(), dist)}`);
