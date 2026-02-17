import {
  createClient,
  SupabaseClient,
  SupabaseClientOptions,
} from '@supabase/supabase-js';
import { Database } from './database.types';

/**
 * Creates and returns a configured Supabase client instance.
 *
 * This function is platform-agnostic and requires the Supabase URL
 * and anon key to be passed directly.
 *
 * @param supabaseUrl The URL of the Supabase project.
 * @param supabaseAnonKey The anonymous/public key for the Supabase project.
 * @param options Optional Supabase client options.
 * @returns Configured SupabaseClient instance.
 * @throws Error if URL or key are missing.
 */
export function createSupabaseClient(
  supabaseUrl: string,
  supabaseAnonKey: string,
  options?: SupabaseClientOptions<'public'>,
): SupabaseClient<Database> {
  if (!supabaseUrl) {
    throw new Error('Missing SUPABASE_URL.');
  }
  if (!supabaseAnonKey) {
    throw new Error('Missing SUPABASE_ANON_KEY.');
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, options);
}
