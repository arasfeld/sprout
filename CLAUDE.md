# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

This is a pnpm monorepo using Turborepo. All top-level commands run through turbo:

- `pnpm dev` — start all apps in dev mode
- `pnpm build` — build all packages/apps
- `pnpm lint` — lint all packages/apps
- `pnpm check-types` — type-check all packages/apps
- `pnpm format` — format all files with Prettier
- `pnpm clean` — clean all build artifacts and node_modules

### Mobile app (apps/mobile)

- `pnpm --filter @sprout/mobile dev` — start Expo dev server
- `pnpm --filter @sprout/mobile ios` — start on iOS
- `pnpm --filter @sprout/mobile android` — start on Android
- `pnpm --filter @sprout/mobile lint` — lint mobile app only
- `pnpm --filter @sprout/mobile check-types` — type-check mobile app only

## Architecture

**Monorepo layout:**
- `apps/mobile` — React Native app (Expo SDK 54, React 19, React Native 0.81)
- `packages/config-eslint` — shared ESLint configs (base.js, expo.js)
- `packages/config-typescript` — shared TypeScript configs (base.json, expo.json)

**Mobile app structure (`apps/mobile/`):**
- `app/` — Expo Router file-based routing with typed routes. Group routes use parentheses (e.g., `(tabs)/`). Each directory has a `_layout.tsx`.
- `components/ui/` — UI primitives (Button, Text, Icon, etc.) with theme integration
- `components/theme-context.tsx` — Context-based theme provider supporting light/dark modes
- `constants/theme.ts` — Color palette, fonts, typography tokens
- `hooks/` — Custom hooks (useTheme, useColorScheme) with platform-specific `.web.ts` variants
- `services/` — Business logic (e.g., storage service using AsyncStorage)
- `utils/` — Utility functions

**Platform-specific files:** Use `.ios.tsx`, `.android.tsx`, `.web.ts` suffixes for platform variants.

## Code Style

- TypeScript strict mode enabled
- Prettier: single quotes, trailing commas, 2-space indent, semicolons
- ESLint with TypeScript, React, React Hooks, and Turbo plugins
- React Compiler and New Architecture are enabled
- Workspace dependencies use `workspace:*` protocol
