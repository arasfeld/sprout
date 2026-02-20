import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  ScrollView,
  StyleSheet,
  View,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as z from 'zod';

import { useChildSelection } from '@/components/child-context';
import { Button } from '@/components/ui/button';
import { DateTimeField } from '@/components/ui/date-time-field';
import { Field, FieldContent, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useCreateEvent } from '@/hooks/mutations/use-create-event';
import { useTheme } from '@/hooks/use-theme';

const activitySchema = z.object({
  startTime: z.date(),
  duration: z.string().optional(),
  notes: z.string().optional(),
});

type ActivityFormValues = z.infer<typeof activitySchema>;

export default function ActivityEventScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { selectedChild } = useChildSelection();
  const { mutateAsync: createEvent, isPending: loading } = useCreateEvent();

  const { control, handleSubmit } = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      startTime: new Date(),
      duration: '',
      notes: '',
    },
  });

  const onSubmit = async (values: ActivityFormValues) => {
    if (!selectedChild) {
      Alert.alert('Error', 'No child selected');
      return;
    }

    try {
      await createEvent({
        child_id: selectedChild.id,
        type: 'activity',
        payload: {
          ...values,
          startTime: values.startTime.toISOString(),
        },
      });
      router.back();
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
  };

  return (
    <BottomSheetModalProvider>
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['bottom']}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.header}>
              <Text variant="title">Log Activity</Text>
              <Text variant="muted">
                Record {selectedChild?.name}&apos;s exercise or play.
              </Text>
            </View>

            <View style={styles.form}>
              <Controller
                control={control}
                name="startTime"
                render={({ field: { onChange, value } }) => (
                  <DateTimeField label="Time" value={value} onSave={onChange} />
                )}
              />

              <Field>
                <FieldLabel>Duration (minutes)</FieldLabel>
                <FieldContent>
                  <Controller
                    control={control}
                    name="duration"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        keyboardType="numeric"
                        placeholder="0"
                        value={value}
                        onChangeText={onChange}
                      />
                    )}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel>Notes</FieldLabel>
                <FieldContent>
                  <Controller
                    control={control}
                    name="notes"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        multiline
                        numberOfLines={4}
                        placeholder="Any notes..."
                        value={value}
                        onChangeText={onChange}
                        style={styles.notesInput}
                      />
                    )}
                  />
                </FieldContent>
              </Field>
            </View>

            <View style={styles.actions}>
              <Button
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
                size="lg"
              >
                {loading ? 'Saving...' : 'Save Activity'}
              </Button>
              <Button
                variant="ghost"
                onPress={() => router.back()}
                disabled={loading}
                size="lg"
              >
                Cancel
              </Button>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 24,
  },
  header: {
    marginBottom: 8,
    gap: 4,
  },
  form: {
    gap: 20,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  actions: {
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
  },
});
