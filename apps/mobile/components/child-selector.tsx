import type { Child } from '@sprout/core';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import React, { useRef } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useChildSelection } from '@/components/child-context';
import { BottomSheet, type BottomSheetRef } from '@/components/ui/bottom-sheet';
import { IconSymbol } from '@/components/ui/icon-symbol';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import { Text } from '@/components/ui/text';
import { useChildren } from '@/hooks/queries/use-children';
import { useTheme } from '@/hooks/use-theme';
import { formatDateLongHuman } from '@/utils/date';

export function ChildSelector() {
  const { colors } = useTheme();
  const { selectedChild, setChildId } = useChildSelection();
  const { data: children = [] } = useChildren();
  const bottomSheetRef = useRef<BottomSheetRef>(null);
  const insets = useSafeAreaInsets();

  if (children.length === 0) return null;

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => bottomSheetRef.current?.open()}
        style={({ pressed }) => [
          styles.selector,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: 1,
          },
          pressed && styles.pressed,
        ]}
      >
        <View style={[styles.avatar, { backgroundColor: colors.muted }]}>
          {selectedChild?.avatar_url ? (
            <Image
              source={{ uri: selectedChild.avatar_url }}
              style={styles.avatarImage}
            />
          ) : (
            <IconSymbol
              name="person.fill"
              size={18}
              color={colors.mutedForeground}
            />
          )}
        </View>
        <Text variant="bodySemibold" style={styles.name}>
          {selectedChild?.name}
        </Text>
        <IconSymbol
          name="chevron.down"
          size={12}
          color={colors.mutedForeground}
        />
      </Pressable>

      <BottomSheet ref={bottomSheetRef}>
        <BottomSheetFlatList
          data={children}
          keyExtractor={(item: Child) => item.id}
          contentContainerStyle={[
            styles.sheetContent,
            { paddingBottom: insets.bottom + 24 },
          ]}
          ListHeaderComponent={() => (
            <View style={styles.sheetHeader}>
              <Text variant="title" style={styles.sheetTitle}>
                Switch Child
              </Text>
              <Text variant="muted" style={styles.sheetSubtitle}>
                Select a child to view their timeline and activities.
              </Text>
            </View>
          )}
          renderItem={({ item }: { item: Child }) => (
            <Item
              variant="default"
              onPress={() => {
                setChildId(item.id);
                bottomSheetRef.current?.close();
              }}
              style={StyleSheet.flatten([
                styles.childItem,
                item.id === selectedChild?.id && {
                  backgroundColor: colors.primary + '10',
                  borderColor: colors.primary + '40',
                },
              ])}
            >
              <ItemMedia>
                <View
                  style={[
                    styles.avatarSmall,
                    { backgroundColor: colors.muted },
                    item.id === selectedChild?.id && {
                      borderColor: colors.primary,
                      borderWidth: 2,
                    },
                  ]}
                >
                  {item.avatar_url ? (
                    <Image
                      source={{ uri: item.avatar_url }}
                      style={styles.avatarImage}
                    />
                  ) : (
                    <IconSymbol
                      name="person.fill"
                      size={14}
                      color={colors.mutedForeground}
                    />
                  )}
                </View>
              </ItemMedia>
              <ItemContent>
                <ItemTitle>{item.name}</ItemTitle>
                <ItemDescription>
                  {formatDateLongHuman(new Date(item.birthdate))}
                </ItemDescription>
              </ItemContent>
              {item.id === selectedChild?.id && (
                <IconSymbol name="checkmark" size={20} color={colors.primary} />
              )}
            </Item>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // No longer centered, will be positioned by parent
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
    paddingRight: 10,
    borderRadius: 24,
    gap: 8,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  avatarSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    marginRight: 4,
  },
  sheetHeader: {
    marginBottom: 24,
  },
  sheetContent: {
    paddingHorizontal: 16,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  sheetSubtitle: {
    fontSize: 15,
    marginTop: 4,
  },
  childItem: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    padding: 4,
  },
});
