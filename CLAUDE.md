# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Turborepo monorepo** with a full-stack TypeScript application consisting of:
- **Backend**: NestJS API server with tRPC integration (port 3000)
- **Frontend**: Next.js 15 with App Router and React 19 (port 3001)
- **Shared packages**: tRPC router definitions, ESLint configs, TypeScript configs

**Package Manager**: pnpm (v10.17.1+)

## Architecture

### tRPC Integration Pattern

The project uses a **shared tRPC router pattern** with automatic schema generation:

1. **Schema-first definition** (`packages/trpc/src/server/server.ts`):
   - tRPC router with Zod schemas defines the API contract
   - Contains placeholder implementations (`"PLACEHOLDER_DO_NOT_REMOVE" as any`)
   - Exports `AppRouter` type for client type safety

2. **NestJS implementation** (`apps/backend/src/`):
   - Uses `nestjs-trpc` library to implement the tRPC routes
   - `TRPCModule.forRoot()` configured with `autoSchemaFile: '../../packages/trpc/src/server'`
   - Router classes use `@Router`, `@Query`, and `@Mutation` decorators
   - **CRITICAL**: The auto-generation **replaces placeholder implementations** in the shared package

3. **Next.js client** (`apps/web/`):
   - Imports `AppRouter` type from `@repo/trpc/router`
   - tRPC React Query client configured in `trpc/client.ts`
   - Provider wraps app in `providers/TrpcProvider.tsx`
   - Uses `NEXT_PUBLIC_TRPC_URL` environment variable for API endpoint

### Module Structure

**Backend** follows NestJS module pattern:
- Feature modules in `apps/backend/src/<feature>/`:
  - `<feature>.module.ts` - Module definition
  - `<feature>.router.ts` - tRPC router implementation with decorators
  - `<feature>.service.ts` - Business logic
  - `<feature>.schema.ts` - Zod schemas and TypeScript types

**Frontend** follows Next.js App Router structure:
- `app/` directory with route-based file structure
- `providers/` for React context providers
- `trpc/` for tRPC client setup

## Development Workflow

### Running the Project

```bash
# Install dependencies (from root)
pnpm install

# Run all apps in development mode
pnpm dev

# Run specific app
pnpm dev --filter=web      # Frontend only (port 3001)
pnpm dev --filter=backend  # Backend only (port 3000)
```

### Building

```bash
# Build all apps
pnpm build

# Build specific app
pnpm build --filter=backend
```

### Linting & Type Checking

```bash
# Lint all packages
pnpm lint

# Type check all packages
pnpm check-types

# Format code
pnpm format
```

### Testing (Backend only)

```bash
# From backend directory (apps/backend)
pnpm test           # Unit tests
pnpm test:e2e       # E2E tests
pnpm test:cov       # Coverage report
pnpm test:watch     # Watch mode
```

## Adding New tRPC Routes

**Critical workflow** to maintain type safety:

1. **Define in shared router** (`packages/trpc/src/server/server.ts`):
   ```typescript
   myNewRoute: publicProcedure
     .input(z.object({ ... }))
     .output(z.object({ ... }))
     .query(async () => "PLACEHOLDER_DO_NOT_REMOVE" as any)
   ```

2. **Create NestJS module** (`apps/backend/src/my-feature/`):
   - Create module, router, service, and schema files
   - Implement router with `@Router`, `@Query`/`@Mutation` decorators
   - Register module in `app.module.ts`

3. **Build backend** to trigger schema auto-generation:
   ```bash
   pnpm build --filter=backend
   ```
   This replaces placeholders with actual implementations

4. **Use in frontend**:
   ```typescript
   const { data } = trpc.myNewRoute.useQuery({ ... });
   ```

## Configuration Files

- **`turbo.json`**: Turborepo pipeline configuration
  - `build` task depends on workspace dependencies (`^build`)
  - `dev` task is persistent and not cached
  - `lint` and `check-types` depend on workspace dependencies

- **ESLint**:
  - Shared configs in `packages/eslint-config/`
  - Backend uses standalone config (`apps/backend/eslint.config.mjs`) with TypeScript type-checking
  - Frontend uses shared Next.js config (`@repo/eslint-config/next-js`)

- **TypeScript**:
  - Shared configs in `packages/typescript-config/`
  - Each app/package has its own `tsconfig.json` extending base configs

## Important Notes

- **Never remove** `"PLACEHOLDER_DO_NOT_REMOVE"` from shared tRPC router - it's replaced during build
- Backend auto-generation writes to `packages/trpc/src/server/`, affecting the shared package
- Frontend and backend must be kept in sync via the shared `@repo/trpc` package
- Use Turbo filters (`--filter=<package>`) to run commands on specific packages
- **Do not use Serena MCP tools** (`mcp__serena__*`) in this project - they are not initialized. Use standard Claude Code tools (Read, Write, Edit, Glob, Grep, Bash) instead
