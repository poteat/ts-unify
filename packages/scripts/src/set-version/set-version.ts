import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "../../../..");
const SCOPE = "@ts-unify/";
const PACKAGES = ["packages/core", "packages/rules", "packages/eslint", "packages/eslint-rules-e2e"];

const version = process.argv[2];
if (!version) {
  console.error("Usage: npm run set-version -- <version>");
  process.exit(1);
}

for (const pkg of PACKAGES) {
  const file = path.join(ROOT, pkg, "package.json");
  const json = JSON.parse(fs.readFileSync(file, "utf-8"));
  json.version = version;

  for (const depType of ["dependencies", "devDependencies", "peerDependencies"] as const) {
    const deps = json[depType] as Record<string, string> | undefined;
    if (!deps) continue;
    for (const dep of Object.keys(deps)) {
      if (dep.startsWith(SCOPE)) {
        deps[dep] = version;
      }
    }
  }

  fs.writeFileSync(file, JSON.stringify(json, null, 2) + "\n");
  console.log(`${json.name} → ${version}`);
}

const rootFile = path.join(ROOT, "package.json");
const rootJson = JSON.parse(fs.readFileSync(rootFile, "utf-8"));
rootJson.version = version;
fs.writeFileSync(rootFile, JSON.stringify(rootJson, null, 2) + "\n");
console.log(`root → ${version}`);
