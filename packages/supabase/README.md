# @sprout/supabase

Centralized Supabase client package for the Sprout childcare tracking system.

## Overview

This package provides a configured Supabase client that handles authentication, database operations, storage, and realtime subscriptions for all Sprout applications (mobile, web, admin).

## Installation

```bash
pnpm add @sprout/supabase
```

## Environment Setup

Create environment variables for your Supabase project:

### Local Development

Create a `.env` file in your app root:

```bash
# .env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Expo/React Native

For Expo apps, you can use `expo-constants` or `react-native-dotenv`:

```typescript
import Constants from 'expo-constants';

// Using expo-constants
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;
```

Add to your `app.config.js`:

```javascript
export default {
  expo: {
    extra: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    },
  },
};
```

## Usage

### Basic Client Usage

```typescript
import { supabase } from '@sprout/supabase';

// Get current user
const {
  data: { user },
} = await supabase.auth.getUser();

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});
```

### Custom Client Instance

```typescript
import { createSupabaseClient } from '@sprout/supabase';

const client = createSupabaseClient();
```

### Database Operations

```typescript
// Query children
const { data: children, error } = await supabase.from('children').select('*');

// Insert event
const { data: event, error } = await supabase.from('events').insert({
  child_id: 'child-uuid',
  type: 'nap',
  data: { duration: 90 },
});
```

### Realtime Subscriptions

```typescript
// Listen for new events
const subscription = supabase
  .channel('events')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'events',
    },
    (payload) => {
      console.log('New event:', payload.new);
    },
  )
  .subscribe();
```

### Storage Operations

```typescript
// Upload photo
const { data, error } = await supabase.storage
  .from('photos')
  .upload('child-uuid/photo.jpg', photoFile);

// Get public URL
const {
  data: { publicUrl },
} = supabase.storage.from('photos').getPublicUrl('child-uuid/photo.jpg');
```

## Development

### Building

```bash
pnpm --filter @sprout/supabase build
```

### Type Checking

```bash
pnpm --filter @sprout/supabase check-types
```

## Database Types

This package is set up to support generated database types. In the future, the `Database` type will be automatically generated from your Supabase schema.

For now, it uses `any` as a placeholder.

## Security Notes

- Always use the anonymous key for client-side operations
- Row Level Security (RLS) should enforce data access rules
- Never expose service role keys in client code
- Environment variables should be secured and not committed to version control
