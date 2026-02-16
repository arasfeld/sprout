# @repo/config-typescript

Shared TypeScript configurations for the Sprout monorepo.

## Overview

This package provides reusable `tsconfig.json` base configs that enforce consistent TypeScript settings across all apps and packages.

## Available Configs

| File | Description |
|---|---|
| `base.json` | Base TypeScript config with strict mode enabled |
| `expo.json` | Extends base with Expo and React Native settings |

## Usage

In your app or package's `tsconfig.json`:

```json
{
  "extends": "@repo/config-typescript/base.json"
}
```

Or for Expo apps:

```json
{
  "extends": "@repo/config-typescript/expo.json"
}
```

## Part of Sprout

This is an internal package in the [Sprout](../../README.md) monorepo. It is not published to npm.
