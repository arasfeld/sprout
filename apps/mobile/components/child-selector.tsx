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
          { backgroundColor: colors.muted },
          pressed && styles.pressed,
        ]}
      >
        <View style={[styles.avatar, { backgroundColor: colors.background }]}>
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
        <Text variant="subtitle" style={styles.name}>
          {selectedChild?.name ?? 'Select child'}
        </Text>
        <IconSymbol
          name="chevron.down"
          size={14}
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
            <Text variant="title" style={styles.sheetTitle}>
              Switch child
            </Text>
          )}
          renderItem={({ item }: { item: Child }) => (
            <Item
              variant="default"
              onPress={() => {
                setChildId(item.id);
                bottomSheetRef.current?.close();
              }}
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
                <ItemDescription>{item.birthdate}</ItemDescription>
              </ItemContent>
              {item.id === selectedChild?.id && (
                <IconSymbol name="checkmark" size={20} color={colors.primary} />
              )}
            </Item>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        />
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    paddingRight: 12,
    borderRadius: 24,
    gap: 10,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.98 }],
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  sheetContent: {
    paddingHorizontal: 16,
  },
  sheetTitle: {
    marginBottom: 16,
    fontSize: 20,
    fontWeight: '700',
  },
});
