import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  type ViewStyle,
} from 'react-native';

import type { Theme } from '@/hooks/use-theme';
import { useTheme } from '@/hooks/use-theme';

import { IconSymbol } from './icon-symbol';
import { Text } from './text';

const OVERLAY_BG = 'rgba(0,0,0,0.5)';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  style?: ViewStyle;
}

export function Select({
  label,
  placeholder = 'Select an option',
  options,
  value,
  onChange,
  style,
}: SelectProps) {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  return (
    <View style={style}>
      {label && (
        <Text variant="label" style={styles.label}>
          {label}
        </Text>
      )}

      <TouchableOpacity
        style={styles.trigger}
        onPress={() => setIsOpen(true)}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.triggerText,
            !selectedOption && styles.placeholderText,
          ]}
        >
          {selectedOption?.label || placeholder}
        </Text>
        <IconSymbol
          name="chevron.down"
          size={20}
          color={theme.colors.mutedForeground}
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label || 'Select'}</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <IconSymbol
                  name="xmark"
                  size={24}
                  color={theme.colors.foreground}
                />
              </TouchableOpacity>
            </View>

            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.option,
                    item.value === value && styles.optionSelected,
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      item.value === value && styles.optionTextSelected,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.value === value && (
                    <IconSymbol
                      name="checkmark"
                      size={20}
                      color={theme.colors.primary}
                    />
                  )}
                </TouchableOpacity>
              )}
              style={styles.optionList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

function createStyles(theme: Theme) {
  const { colors, typography, spacing, radius } = theme;
  return StyleSheet.create({
    label: {
      marginBottom: spacing.sm,
    },
    modalContent: {
      backgroundColor: colors.card,
      borderTopLeftRadius: radius.xl,
      borderTopRightRadius: radius.xl,
      maxHeight: '70%',
    },
    modalHeader: {
      alignItems: 'center',
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: spacing.lg,
    },
    modalTitle: {
      color: colors.foreground,
      fontSize: typography.fontSize.lg,
      fontWeight: typography.fontWeight.semibold,
    },
    option: {
      alignItems: 'center',
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: spacing.lg,
    },
    optionList: {
      paddingBottom: spacing.xl,
    },
    optionSelected: {
      backgroundColor: colors.accent,
    },
    optionText: {
      color: colors.foreground,
      fontSize: typography.fontSize.md,
    },
    optionTextSelected: {
      color: colors.primary,
      fontWeight: typography.fontWeight.semibold,
    },
    overlay: {
      backgroundColor: OVERLAY_BG,
      flex: 1,
      justifyContent: 'flex-end',
    },
    placeholderText: {
      color: colors.mutedForeground,
    },
    trigger: {
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: radius.lg,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: spacing.md,
    },
    triggerText: {
      color: colors.foreground,
      flex: 1,
      fontSize: typography.fontSize.md,
    },
  });
}
