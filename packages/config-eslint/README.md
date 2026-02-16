# @repo/config-eslint

Shared ESLint configurations for the Sprout monorepo.

## Overview

This package provides reusable ESLint configs that enforce consistent code quality and style across all apps and packages.

## Available Configs

| Export | File | Description |
|---|---|---|
| `@repo/config-eslint/base` | `base.js` | Base config with TypeScript, React, Prettier, and Turbo plugins |
| `@repo/config-eslint/expo` | `expo.js` | Extends base with Expo-specific rules |

## Usage

In your app or package's `eslint.config.mjs`:

```js
import { base } from '@repo/config-eslint/base';

export default [...base];
```

Or for Expo apps:

```js
import { expo } from '@repo/config-eslint/expo';

export default [...expo];
```

## Included Plugins

- `@eslint/js` — core ESLint rules
- `typescript-eslint` — TypeScript-aware linting
- `eslint-plugin-react` / `eslint-plugin-react-hooks` — React rules
- `eslint-config-expo` — Expo-specific rules
- `eslint-config-prettier` / `eslint-plugin-prettier` — Prettier integration
- `eslint-plugin-turbo` — Turborepo cache safety rules

## Part of Sprout

This is an internal package in the [Sprout](../../README.md) monorepo. It is not published to npm.
