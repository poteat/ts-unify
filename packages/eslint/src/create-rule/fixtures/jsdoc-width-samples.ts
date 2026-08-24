import { COLUMNS } from './columns'

/**
 * JSDoc blocks against the column budget: each `within` sample fits on
 * every line, each `over` sample passes it by one on some line.
 */
export const JSDOC_WIDTH_SAMPLES = {
  within: [
    `/**\n * ${'y'.repeat(COLUMNS - ' * '.length)}\n */\nfunction f() {}`,
    `  /** ${'y'.repeat(COLUMNS - '  /** '.length - ' */'.length)} */\n` +
      '  function f() {}',
    `// ${'x'.repeat(COLUMNS + COLUMNS)}\nfunction f() {}`,
  ],
  over: [
    `/**\n * ${'y'.repeat(COLUMNS - ' * '.length + 1)}\n */\nfunction f() {}`,
    `    /** ${'y'.repeat(COLUMNS - '    /** '.length - ' */'.length + 1)}` +
      ' */\n    function f() {}',
    `/** ${'y'.repeat(COLUMNS - '/** '.length + 1)}\n * short\n */\n` +
      'function f() {}',
  ],
} as const
