# Sprout Mobile

The React Native mobile app for Sprout, built with Expo SDK 54, React 19, and React Native 0.81.

This is the primary client for the Sprout childcare tracking system. Parents, caregivers, and daycare staff use this app to view and log events on a child's shared timeline.

## Current Status

The UI is under active development. The app uses **Supabase Auth** (email/password sign up and sign in) and is session-aware; unauthenticated users see the sign-in screen first. Backend integration is being introduced incrementally — the home tab can be wired to real data (e.g. children for the current user) as a next step. Use mock/local data for features not yet connected.

## Folder Structure

```
apps/mobile/
  app/                  → Expo Router file-based routing
    _layout.tsx         → Root layout (AuthProvider, Stack)
    index.tsx           → Session gate (redirects to sign-in or tabs)
    (auth)/             → Auth group (sign-in, sign-up)
      _layout.tsx
      sign-in.tsx
      sign-up.tsx
    (tabs)/             → Tab group
      _layout.tsx       → Tab navigator layout
      index.tsx         → Home tab (My children list)
      child/[id].tsx    → Child detail (timeline placeholder)
      settings.tsx      → Settings tab
  components/
    ui/                 → Reusable UI primitives (Button, Text, Icon, etc.)
    theme-context.tsx   → React Context theme provider
    ...                 → App-level components
  constants/
    theme.ts            → Design tokens (colors, typography, spacing, radius)
  hooks/
    use-theme.ts        → Theme access hook
    use-theme.web.ts    → Web-specific theme hook
    use-color-scheme.ts → System color scheme detection
    use-color-scheme.web.ts → Web-specific color scheme detection
  services/
    storage.ts          → AsyncStorage wrapper
  types/
    preferences.ts      → Domain type definitions
  utils/
    color.ts            → Color utility functions
```

## Design System

This app uses a **shadcn-inspired design system** adapted for React Native. All UI is built with semantic design tokens — no hardcoded colors or typography values.

### Theme File

`constants/theme.ts` is the single source of truth for all design tokens:

- **Colors:** Semantic tokens (background, foreground, primary, secondary, muted, accent, destructive, border, input, ring, card, popover) defined for both light and dark modes
- **Typography:** Font families, sizes, weights, and line heights
- **Spacing:** Consistent spacing scale
- **Radius:** Border radius tokens

### Theme Provider

`components/theme-context.tsx` wraps the app in a React Context provider that supplies the current theme (light or dark) to all descendant components.

### `useTheme()` Hook

The `useTheme()` hook (from `hooks/use-theme.ts`) is the **only way** components should access design tokens. It returns the current theme object, which includes all color, typography, spacing, and radius tokens.

```tsx
import { useTheme } from '@/hooks/use-theme';

function MyComponent() {
  const { colors, typography, spacing } = useTheme();

  return (
    <View style={{ backgroundColor: colors.background, padding: spacing[4] }}>
      <Text style={{ color: colors.foreground }}>Hello</Text>
    </View>
  );
}
```

Platform-specific variants (`use-theme.web.ts`, `use-color-scheme.web.ts`) handle web platform differences automatically.

### UI Components

All reusable UI primitives live in `components/ui/`:

| Component         | File                    | Description                              |
| ----------------- | ----------------------- | ---------------------------------------- |
| Button            | `button.tsx`            | Pressable button with variant/size props |
| Text              | `text.tsx`              | Themed text with typography variants     |
| Icon              | `icon-symbol.tsx`       | SF Symbols (iOS) and Material Icons      |
| Input             | `input.tsx`             | Themed text input for forms              |
| Collapsible       | `collapsible.tsx`       | Expandable/collapsible content           |
| Segmented Control | `segmented-control.tsx` | Tab-like segmented selector              |

#### Building new UI components

1. Create the file in `components/ui/`
2. Import and use `useTheme()` for all styling
3. Use semantic tokens — never hardcode colors or font sizes
4. Follow shadcn-style prop patterns (`variant`, `size`, etc.)
5. Keep components composable and focused on a single responsibility

**Placement rule:** Reusable UI goes in `components/ui/`. Feature-specific UI stays local to the feature directory.

## Routing

This app uses [Expo Router](https://docs.expo.dev/router/introduction/) for file-based routing with typed routes.

- Routes are defined by the file structure inside `app/`
- Group routes use parentheses: `(tabs)/` groups tab screens without adding a URL segment
- Each route group has a `_layout.tsx` defining its navigator

## Data

The app talks directly to **Supabase** — no custom API server. **Supabase Auth** handles sign up and sign in; session is persisted via AsyncStorage. Domain types are defined in `types/`. User preferences are also persisted locally via AsyncStorage (`services/storage.ts`). The home tab can be wired to load children (and other data) for the current user; Supabase Realtime will power live timeline updates.

## Development

```bash
# From the monorepo root:
pnpm --filter @sprout/mobile dev       # Start Expo dev server
pnpm --filter @sprout/mobile ios       # Run on iOS Simulator
pnpm --filter @sprout/mobile android   # Run on Android Emulator
pnpm --filter @sprout/mobile lint      # Lint
pnpm --filter @sprout/mobile check-types  # Type-check
```
