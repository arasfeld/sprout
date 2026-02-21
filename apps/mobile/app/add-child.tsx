import type { Sex } from '@sprout/core';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '@/components/auth-context';
import {
  DatePickerModal,
  type DatePickerModalRef,
} from '@/components/ui/date-picker-modal';
import { Button } from '@/components/ui/button';
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
  FieldSet,
} from '@/components/ui/field';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Input } from '@/components/ui/input';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Text } from '@/components/ui/text';
import { SEX_OPTIONS } from '@/constants/sex';
import { useCreateChild } from '@/hooks/mutations/use-create-child';
import { useChildSelection } from '@/components/child-context';
import { type Theme, useTheme } from '@/hooks/use-theme';
import { uploadFile } from '@/services/upload';
import { formatDate, formatDateHuman } from '@/utils/date';

export default function AddChildScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { mutateAsync: createChild, isPending: loading } = useCreateChild();
  const { setChildId } = useChildSelection();

  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState<Date>(new Date());
  const [sex, setSex] = useState<Sex | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const datePickerRef = useRef<DatePickerModalRef>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
  }>({});

  const handlePickImage = useCallback(async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need access to your photos to upload an avatar.',
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setUploading(true);
        const url = await uploadFile(result.assets[0].uri, 'avatars');
        if (url) {
          setAvatarUrl(url);
        } else {
          Alert.alert('Upload Failed', 'Could not upload your photo.');
        }
        setUploading(false);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      setUploading(false);
    }
  }, []);

  const handleSaveDate = (date: Date) => {
    setBirthdate(date);
  };

  const handleCancelDate = useCallback(() => {
    datePickerRef.current?.close();
  }, []);

  const handleSubmit = useCallback(async () => {
    setError(null);
    setFieldErrors({});

    const nameTrimmed = name.trim();
    if (!nameTrimmed) {
      setFieldErrors((e) => ({ ...e, name: 'Name is required' }));
      return;
    }

    if (!user?.id) {
      setError('You must be signed in to add a child.');
      return;
    }

    try {
      const result = await createChild({
        name: nameTrimmed,
        birthdate: formatDate(birthdate),
        sex,
        avatar_url: avatarUrl,
      });
      if (result?.id) {
        await setChildId(result.id);
      }
      router.back();
    } catch (e) {
      setError((e as Error).message);
    }
  }, [
    name,
    birthdate,
    sex,
    avatarUrl,
    user?.id,
    router,
    createChild,
    setChildId,
  ]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  if (!user) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <View style={styles.centered}>
          <Text variant="subtitle" style={{ color: colors.destructive }}>
            You must be signed in to add a child.
          </Text>
          <Button onPress={handleBack} style={styles.backButton}>
            Cancel
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboard}
      >
        <View style={styles.content}>
          <View style={styles.avatarContainer}>
            <Pressable
              style={({ pressed }) => [
                styles.avatarWrapper,
                pressed && { opacity: 0.7 },
              ]}
              onPress={handlePickImage}
              disabled={uploading}
            >
              <View
                style={[styles.avatarCircle, { backgroundColor: colors.muted }]}
              >
                {avatarUrl ? (
                  <Image
                    source={{ uri: avatarUrl }}
                    style={styles.avatarImage}
                    contentFit="cover"
                  />
                ) : (
                  <IconSymbol
                    name="face.smiling"
                    size={48}
                    color={colors.mutedForeground}
                  />
                )}
                {uploading && (
                  <View
                    style={[
                      styles.uploadOverlay,
                      { backgroundColor: 'rgba(0,0,0,0.4)' },
                    ]}
                  >
                    <ActivityIndicator color="#fff" />
                  </View>
                )}
              </View>
              <View
                style={[
                  styles.cameraIcon,
                  { backgroundColor: colors.background },
                ]}
              >
                <IconSymbol
                  name="camera.fill"
                  size={12}
                  color={colors.foreground}
                />
              </View>
            </Pressable>
          </View>
          <Text
            variant="muted"
            style={[styles.subtitle, { color: colors.mutedForeground }]}
          >
            Add a child to your timeline. You can log events and share with
            other caregivers.
          </Text>
          <FieldSet style={styles.form}>
            <Field invalid={Boolean(fieldErrors.name)}>
              <FieldLabel>Name</FieldLabel>
              <FieldContent>
                <Input
                  autoCapitalize="words"
                  autoComplete="name"
                  placeholder="Child's name"
                  value={name}
                  onChangeText={setName}
                  editable={!loading}
                />
                <FieldError
                  errors={
                    fieldErrors.name
                      ? [{ message: fieldErrors.name }]
                      : undefined
                  }
                />
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Birth date</FieldLabel>
              <FieldContent>
                <Pressable
                  onPress={() => {
                    datePickerRef.current?.open();
                  }}
                  style={({ pressed }) => [
                    styles.datePickerTrigger,
                    {
                      backgroundColor:
                        theme.mode === 'dark'
                          ? `${colors.input}4D`
                          : colors.input,
                      borderColor: colors.border,
                    },
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Text style={{ color: colors.foreground }}>
                    {formatDateHuman(birthdate)}
                  </Text>
                  <IconSymbol
                    name="chevron.right"
                    size={20}
                    color={colors.mutedForeground}
                  />
                </Pressable>
              </FieldContent>
            </Field>

            <Field>
              <FieldLabel>Sex</FieldLabel>
              <FieldContent>
                <SegmentedControl
                  options={SEX_OPTIONS}
                  selectedIndex={
                    sex ? SEX_OPTIONS.findIndex((o) => o.value === sex) : -1
                  }
                  onValueChange={(index) => {
                    setSex(SEX_OPTIONS[index]?.value as Sex);
                  }}
                  disabled={loading}
                />
              </FieldContent>
            </Field>
            {error ? (
              <FieldError>
                <Text variant="muted" style={{ color: colors.destructive }}>
                  {error}
                </Text>
              </FieldError>
            ) : null}
            <View style={styles.actions}>
              <Button
                onPress={handleSubmit}
                disabled={loading}
                style={styles.submitButton}
                size="lg"
              >
                {loading ? 'Adding…' : 'Add child'}
              </Button>
            </View>
          </FieldSet>
        </View>
      </KeyboardAvoidingView>

      <DatePickerModal
        ref={datePickerRef}
        value={birthdate}
        onClose={handleCancelDate}
        onSave={handleSaveDate}
        title="Enter birthday"
        maximumDate={new Date()}
      />
    </SafeAreaView>
  );
}

function createStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    keyboard: {
      flex: 1,
    },
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    backButton: {
      marginTop: 16,
    },
    content: {
      flex: 1,
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    avatarContainer: {
      alignItems: 'center',
      marginBottom: 24,
    },
    avatarWrapper: {
      width: 96,
      height: 96,
    },
    avatarCircle: {
      width: '100%',
      height: '100%',
      borderRadius: 48,
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    avatarImage: {
      width: '100%',
      height: '100%',
    },
    uploadOverlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cameraIcon: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      width: 28,
      height: 28,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 2,
      borderColor: theme.colors.background,
      zIndex: 1,
    },
    subtitle: {
      marginBottom: 24,
    },
    form: {
      gap: 20,
    },
    actions: {
      marginTop: 8,
    },
    submitButton: {
      flex: 0,
    },
    datePickerTrigger: {
      height: 48,
      borderWidth: 2,
      borderRadius: theme.radius.md,
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  });
}
