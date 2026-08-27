/**
 * The tsc-alias replacer for @ts-unify/rules: every `@/...` and `@` import
 * becomes `@ts-unify/core`, whose barrel re-exports all of them.
 *
 * @param alias the import as tsc-alias found it, its text under `orig`
 * @returns the text with the alias replaced
 */
const replacer = alias =>
  alias.orig
    .replace(/require\(["']@\/[^"']+["']\)/g, 'require("@ts-unify/core")')
    .replace(/from ["']@\/[^"']+["']/g, 'from "@ts-unify/core"')
    .replace(/import\(["']@\/[^"']+["']\)/g, 'import("@ts-unify/core")')
    .replace(/require\(["']@["']\)/g, 'require("@ts-unify/core")')
    .replace(/from ["']@["']/g, 'from "@ts-unify/core"')
    .replace(/import\(["']@["']\)/g, 'import("@ts-unify/core")')

module.exports = replacer
module.exports.default = replacer
