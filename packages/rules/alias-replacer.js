/**
 * Custom tsc-alias replacer for @ts-unify/rules.
 *
 * Rewrites `@/ast`, `@/capture`, `@/config`, `@/pattern`, etc.
 * to `@ts-unify/core` since core re-exports everything from its barrel.
 */
function replacer({ orig, file, config }) {
  // Match require("@/..."), from "@/...", and import("@/...")
  const newImport = orig
    .replace(/require\(["']@\/[^"']+["']\)/g, 'require("@ts-unify/core")')
    .replace(/from ["']@\/[^"']+["']/g, 'from "@ts-unify/core"')
    .replace(/import\(["']@\/[^"']+["']\)/g, 'import("@ts-unify/core")')
    .replace(/require\(["']@["']\)/g, 'require("@ts-unify/core")')
    .replace(/from ["']@["']/g, 'from "@ts-unify/core"')
    .replace(/import\(["']@["']\)/g, 'import("@ts-unify/core")');
  return newImport;
}

module.exports = replacer;
module.exports.default = replacer;
