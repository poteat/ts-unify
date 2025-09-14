# ts-unify

Heavy WIP

## Contributing & Docs

For repository conventions and agent rules, see AGENTS.md. It links to the
current set of documents under `.agent/`.

## Scripts

- `npm run build` — Builds library output using `tsconfig.build.json` (excludes
  tests).
- `npm run typecheck` — Type-checks everything in `src` (includes tests), no
  emit.
- `npm test` — Runs Jest test suites.
- `npm run test:watch` — Runs Jest in watch mode.
- `npm run test:coverage` — Runs Jest with coverage output.
- `npm run lint` — ESLint over `src/**/*.ts`.
- `npm run prepublishOnly` — Builds before publishing.

## License

MIT. See LICENSE.md for full text.
