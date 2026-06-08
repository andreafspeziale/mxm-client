# Agent Guidelines for mxm-client

## Build, Lint, Test Commands

- **Build**: `pnpm build` (uses tsdown for dual CJS/ESM)
- **Type check**: `pnpm build:check` (TypeScript noEmit)
- **Lint**: `pnpm biome:check` or `pnpm biome:fix` (auto-fix)
- **Test all**: `pnpm test` (uses tap)
- **Test single file**: `pnpm test src/path/to/file.spec.ts`
- **E2E tests**: `MXM_API_KEY=<key> pnpm test src/mxm-client.client.e2e.ts` (skipped automatically when no key is set)

## Code Style

- **Formatter**: Biome with single quotes, trailing commas, semicolons always, space indentation
- **Imports**: Use `.js` extension for relative imports (ESM requirement), organize imports automatically
- **Types**: Strict TypeScript (strictest + recommended + node24 configs), use `type` imports, prefer interfaces for objects
- **Naming**: camelCase for functions/variables, PascalCase for classes/types/interfaces, UPPER_SNAKE_CASE for constants
- **Error handling**: Custom `MxmClientError` class extending base `APIError`, include method/path/statusCode in error details
- **Async**: Use async/await, return typed Promises with `Promise<MxmClientResponse<T>>`
- **Testing**: Use `tap` test runner, mock with `undici` MockAgent, organize tests with `t.test()` blocks
- **File structure**: Endpoints in `src/endpoints/{name}/` with handler.ts, schema.ts, interfaces.ts, constants.ts, handler.spec.ts
- **Input types**: Structured `{ query, body }` via `EndpointPayload<TParams, TQuery, TBody>`. Client methods accept `{ query, apiKey? }` (GET) or `{ query?, body, apiKey? }` (POST). Payload types named `*Query` (GET) or `*Query` + `*Body` (POST)
- **Typescript "as"**: It's a last resort, only when it's strictly necessary, still type-safe and improves DX. Otherwise, fix the types properly

## Git Branch, Commit, PR and Release Conventions

Conventions follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification.

### Branch Names

- `<type>/<#issue-number>-<short-description>`
- `<type>/<short-description>` when no issue is linked

Examples:
- `feat/#151-get-document-command`
- `fix/#139-error-bubble`
- `chore/deps-upgrade`

### Commit Messages

Changes must be atomic and follow the format:

- `<type>: <description>`

Examples:
- `feat: add get document command`
- `fix: properly bubble up errors from CLI bootstrap`
- `chore: upgrade dependencies and fix vulnerabilities`

### Branching Model

The project uses a two-branch model:

- `develop`: default branch, integration target for all feat/fix/chore branches
- `main`: stable release branch, only receives merges from develop

### Pull Requests

feat/fix/chore PRs target develop with a title matching the conventional commit format (e.g. feat: add exists document command).

In case of a linked GitHub issue, the PR body must contain only the sentence "Closes <#issue-number>". Instead, if no issue is linked, the PR body must contain a short description of the change.

Release PRs merge develop into main with the title "Stable release" and empty body.

### Releases

Releases are automatically created by GitHub Actions when develop is merged into main. You must not create releases manually, push directly to main or bump the version in package.json.
