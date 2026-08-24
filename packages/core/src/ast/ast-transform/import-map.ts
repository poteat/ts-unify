import type { ConfigSlot } from '@/config/config-type'

/**
 * The imports a rewrite's output needs: each key a specifier, each value
 * the module path or a config slot that holds it.
 *
 * `"foo"` is `import { foo }`, `"foo as Bar"` is `import { foo as Bar }`,
 * `"default as foo"` is `import foo`, and `"* as foo"` is
 * `import * as foo`.
 */
export type ImportMap = Readonly<Record<string, string | ConfigSlot>>
