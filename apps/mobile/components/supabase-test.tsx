import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from '@/services/supabase';

export function SupabaseTest() {
  const [status, setStatus] = useState<string>('Not tested');
  const [error, setError] = useState<string | null>(null);
  const [childrenData, setChildrenData] = useState<any[] | null>(null);

  const testSupabaseConnection = async () => {
    try {
      setStatus('Testing...');
      setError(null);
      setChildrenData(null); // Clear previous data

      // Test basic client instantiation
      const client = supabase;

      // Test auth method availability
      const { error: sessionError } = await client.auth.getSession();

      if (sessionError) {
        // This is expected without proper env vars, but confirms client works
        setStatus('✓ Client working (no session - expected)');
      } else {
        setStatus('✓ Client working with session');
      }

      console.log('Supabase client test passed');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      setStatus('❌ Test failed');
      console.error('Supabase client test failed:', err);
    }
  };

  const testDataFetch = async () => {
    try {
      setStatus('Fetching children data...');
      setError(null);
      setChildrenData(null);

      // Database types have empty Tables until supabase:gen-types is run; cast for this test.
      const { data, error: fetchError } = await (
        supabase as unknown as {
          from: (table: string) => {
            select: (cols: string) => {
              limit: (
                n: number,
              ) => Promise<{ data: unknown[] | null; error: unknown }>;
            };
          };
        }
      )
        .from('children')
        .select('*')
        .limit(5);

      if (fetchError) {
        throw fetchError;
      }

      if (data && data.length > 0) {
        setChildrenData(data);
        setStatus('✓ Data fetched successfully');
      } else {
        setStatus('✓ No children data found (expected if table is empty)');
      }
      console.log('Supabase data fetch test passed');
    } catch (err: unknown) {
      const raw =
        err && typeof err === 'object' && 'message' in err
          ? String((err as { message: unknown }).message)
          : '';
      const code =
        err && typeof err === 'object' && 'code' in err
          ? (err as { code: unknown }).code
          : undefined;
      const isMissingTable =
        code === 'PGRST205' ||
        /Could not find the table .* in the schema cache/i.test(raw);
      const errorMessage = isMissingTable
        ? "The 'children' table wasn't found. Apply migrations: from repo root run pnpm --filter @sprout/supabase supabase:push (local), or deploy migrations to your remote project."
        : err instanceof Error
          ? err.message
          : 'Unknown error';
      setError(errorMessage);
      setStatus('❌ Data fetch failed');
      console.error('Supabase data fetch test failed:', err);
    }
  };

  const statusColor = status.includes('✓')
    ? '#10b981'
    : status.includes('❌')
      ? '#ef4444'
      : '#6b7280';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Supabase Integration Test</Text>

      <View style={styles.statusContainer}>
        <Text style={styles.statusLabel}>Status:</Text>
        <Text style={[styles.status, { color: statusColor }]}>{status}</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorLabel}>Error:</Text>
          <Text style={styles.error}>{error}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={testSupabaseConnection}>
        <Text style={styles.buttonText}>Test Supabase Client</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={testDataFetch}>
        <Text style={styles.buttonText}>Fetch Children Data</Text>
      </TouchableOpacity>

      {childrenData && childrenData.length > 0 && (
        <View style={styles.dataContainer}>
          <Text style={styles.dataLabel}>Fetched Children (first 5):</Text>
          {childrenData.map((child, index) => (
            <Text key={child.id || index} style={styles.dataItem}>
              - {child.name} (ID: {child.id})
            </Text>
          ))}
        </View>
      )}
      {childrenData && childrenData.length === 0 && (
        <View style={styles.dataContainer}>
          <Text style={styles.dataLabel}>
            No children found in the database.
          </Text>
        </View>
      )}

      <Text style={styles.note}>
        Note: This test verifies the client can be imported and basic methods
        work. Authentication errors are expected without proper environment
        variables.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    margin: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  statusLabel: {
    fontWeight: '600',
    marginRight: 8,
  },
  status: {
    flex: 1,
  },
  errorContainer: {
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#fef2f2',
    borderRadius: 4,
  },
  errorLabel: {
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 4,
  },
  error: {
    color: '#dc2626',
    fontSize: 12,
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  dataContainer: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#f0f9ff',
    borderRadius: 4,
    borderColor: '#38bdf8',
    borderWidth: 1,
  },
  dataLabel: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#0ea5e9',
  },
  dataItem: {
    fontSize: 14,
    color: '#075985',
  },
  note: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 12,
  },
});
