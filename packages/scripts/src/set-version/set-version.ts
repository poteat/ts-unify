import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "../../../..");
const SCOPE = "@ts-unify/";
const PACKAGES_DIR = path.join(ROOT, "packages");

const version = process.argv[2];
if (!version) {
  console.error("Usage: npm run set-version -- <version>");
  process.exit(1);
}

const packageDirs = fs
  .readdirSync(PACKAGES_DIR, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => path.join(PACKAGES_DIR, d.name))
  .filter((d) => fs.existsSync(path.join(d, "package.json")));

for (const dir of packageDirs) {
  const file = path.join(dir, "package.json");
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
