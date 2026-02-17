import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSupabaseClient } from '@sprout/supabase';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase URL or anon key');
}

// On native platforms, Supabase JS uses AsyncStorage for session persistence.
// We need to provide it with a storage implementation.
const storage =
  Platform.OS === 'web'
    ? undefined
    : {
        setItem: (key: string, value: string) => {
          return AsyncStorage.setItem(key, value);
        },
        getItem: (key: string) => {
          return AsyncStorage.getItem(key);
        },
        removeItem: (key: string) => {
          return AsyncStorage.removeItem(key);
        },
      };

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Only relevant for web
  },
});
