# Repository Guidelines

## Project Structure & Module Organization
This pnpm + Turborepo monorepo groups runtime apps under `apps/` and shared code under `packages/`. `apps/backend` hosts the NestJS TRPC API, with services and routers in `src/` and Jest specs beside them as `*.spec.ts`. `apps/web` contains the Next.js 15 client (`app/` routes, `providers/` setup, assets in `public/`), while `packages/trpc`, `packages/eslint-config`, and `packages/typescript-config` supply shared router definitions, lint presets, and tsconfig bases.

## Build, Test, and Development Commands
Install dependencies with `pnpm install` (Node >=18). `pnpm dev` kicks off all dev pipelines (Nest on 3000, Next on 3001); use `pnpm --filter backend dev` or `pnpm --filter web dev` for focus. `pnpm build`, `pnpm lint`, `pnpm check-types`, and `pnpm format` cascade to the packages’ scripts; add `--filter <scope>` when you only need one target.

## Coding Style & Naming Conventions
All code is TypeScript and formatted by Prettier; run `pnpm format` before committing. The root formatter uses default spacing and double quotes, while `apps/backend/.prettierrc` switches to single quotes and trailing commas—match whichever applies. Flat ESLint configs from `@repo/eslint-config` enforce Next.js and TypeScript best practices and the backend config only relaxes a few `@typescript-eslint` warnings; keep naming consistent with PascalCase classes/components and kebab-case filenames such as `todos.service.ts`.

## Testing Guidelines
Nest tests use Jest with `ts-jest`. Co-locate unit coverage as `*.spec.ts`, execute with `pnpm --filter backend test`, and generate reports through `pnpm --filter backend test:cov` (target ≥80% line coverage, output in `apps/backend/coverage`). `pnpm --filter backend test:e2e` reads `test/jest-e2e.json` for end-to-end runs; align on tooling before adding frontend suites so they can be wired into Turborepo.

## Commit & Pull Request Guidelines
Recent history follows Conventional Commits (`feat(scope): summary`), so keep scoping messages to the touched area, e.g. `feat(trpc): expose todo router`. Pull requests should include a clear intent paragraph, linked issues (`Fixes #123`), and screenshots for UI updates. Verify `pnpm lint`, `pnpm check-types`, and the relevant test filter locally; mention any follow-up tasks or schema changes in the description.

## Environment & Configuration Tips
Store environment variables per app; `apps/web/.env` seeds TRPC URLs for local dev and should be templated but not committed with secrets. Restart dev servers when editing anything under `packages/` so downstream apps reload compiled output. If a Turbo cache obscures config updates, rerun with `pnpm turbo run <task> -- --force`.
