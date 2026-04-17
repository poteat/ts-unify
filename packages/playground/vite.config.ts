import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../.."
);
const src = (pkg: string, file = "index.ts") =>
  path.join(root, "packages", pkg, "src", file);

export default defineConfig({
  plugins: [react(), nodePolyfills()],
  base: "/",
  build: {
    outDir: "dist",
  },
  resolve: {
    alias: {
      "@ts-unify/core/internal": src("core", "internal.ts"),
      "@ts-unify/core": src("core"),
      "@ts-unify/engine": src("engine"),
      "@ts-unify/runner": src("runner"),
      "@ts-unify/rules": src("rules"),
      "@/": path.join(root, "packages/core/src/") + path.sep,
      "@": src("core"),
    },
  },
  optimizeDeps: {
    exclude: [
      "@ts-unify/core",
      "@ts-unify/core/internal",
      "@ts-unify/engine",
      "@ts-unify/runner",
      "@ts-unify/rules",
    ],
  },
});
