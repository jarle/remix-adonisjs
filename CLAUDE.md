# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

remix-adonisjs is a monorepo that combines Remix with AdonisJS 6, providing a full-stack framework with database ORM, authentication, middleware, mailer, and dependency injection capabilities. It consists of two main packages:

- `packages/adapter` - The core @matstack/remix-adonisjs adapter package that bridges Remix and AdonisJS
- `packages/reference-app` - A sample application used for integration testing and development

## Development Commands

### Workspace Commands (run from root)
- `pnpm dev` - Start development servers for all packages in parallel
- `pnpm dev:adapter` - Start only the adapter package in watch mode
- `pnpm dev:app` - Start only the reference app dev server
- `pnpm build` - Build all packages
- `pnpm test` - Run tests for all packages

### Adapter Package Commands (packages/adapter)
- `pnpm run dev` - TypeScript watch mode compilation
- `pnpm run test` - Run adapter tests with NODE_DEBUG enabled
- `pnpm run quick:test` - Run tests without debug output
- `pnpm run lint` - ESLint checking
- `pnpm run typecheck` - TypeScript type checking
- `pnpm run build` - Clean, compile, and prepare for publishing

### Reference App Commands (packages/reference-app)
- `pnpm run dev` - Start AdonisJS development server with Remix
- `pnpm run build` - Build the application (includes React Router typegen)
- `pnpm run test` - Run integration tests
- `pnpm run lint` - ESLint checking
- `pnpm run typecheck` - TypeScript type checking

## Architecture

### Adapter Package Structure
The adapter bridges React Router 7 (formerly Remix) with AdonisJS:
- `src/remix_adapter.ts` - Core adapter implementation for handling requests/responses between frameworks
- `providers/remix_provider.ts` - AdonisJS service provider for registering Remix functionality
- `src/hooks/` - Build hooks for integration
- `src/types/` - TypeScript type definitions
- `commands/` - Ace commands for scaffolding (e.g., `node ace remix:route`)

### Reference App Structure
Standard AdonisJS 6 application structure with Remix integration:
- `app/` - AdonisJS controllers, middleware, models, etc.
- `resources/remix_app/` - Remix application code (routes, components)
- `config/` - AdonisJS configuration files
- `database/` - Migrations and database setup
- `adonisrc.ts` - AdonisJS configuration with remix-adonisjs provider

The reference app uses path imports (e.g., `#controllers/*`, `#models/*`) for clean module resolution.

## Testing

The reference app serves as the primary integration test suite. Tests are located in:
- `packages/adapter/tests/` - Unit tests for adapter functionality
- `packages/reference-app/tests/` - Integration tests using Japa test runner

Both packages use Japa for testing with different configurations appropriate to their scope.

## Package Management

This project uses pnpm workspaces. The adapter package depends on React Router 7 as peer dependencies, allowing flexibility in the consuming application's React Router version.

## Route Generation

Use the custom Ace command to generate new Remix routes:
```
node ace remix:route my-route
node ace remix:route --action my-route  # Include server action
```