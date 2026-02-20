import type { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { StyleSheet, View } from 'react-native';

import { BottomSheet, type BottomSheetRef } from './bottom-sheet';
import { Button } from './button';
import { DateTimePicker } from './date-time-picker';
import { Text } from './text';

interface DatePickerModalProps {
  onClose: () => void;
  onSave: (date: Date) => void;
  value: Date;
  title?: string;
  maximumDate?: Date;
  mode?: 'date' | 'time' | 'datetime';
}

export type DatePickerModalRef = BottomSheetRef;

export const DatePickerModal = forwardRef<
  DatePickerModalRef,
  DatePickerModalProps
>(
  (
    {
      onClose,
      onSave,
      value,
      title = 'Enter date',
      maximumDate,
      mode = 'date',
    },
    ref,
  ) => {
    const [tempDate, setTempDate] = useState<Date>(value);
    const bottomSheetRef = useRef<BottomSheetRef>(null);

    useImperativeHandle(ref, () => ({
      open() {
        setTempDate(value);
        bottomSheetRef.current?.open();
      },
      close() {
        bottomSheetRef.current?.close();
      },
    }));

    const onDateChange = useCallback(
      (_event: DateTimePickerEvent, selectedDate?: Date) => {
        if (selectedDate) {
          setTempDate(selectedDate);
        }
      },
      [],
    );

    const handleSave = useCallback(() => {
      onSave(tempDate);
      bottomSheetRef.current?.close();
    }, [onSave, tempDate]);

    return (
      <BottomSheet ref={bottomSheetRef} onDismiss={onClose}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text variant="bodySemibold">{title}</Text>
          </View>
          <View style={styles.body}>
            <DateTimePicker
              value={tempDate}
              mode={mode}
              display="spinner"
              onChange={onDateChange}
              maximumDate={maximumDate}
              style={{ height: 200, width: '100%' }}
            />
          </View>
          <View style={styles.footer}>
            <Button
              variant="ghost"
              onPress={onClose}
              style={{ flex: 1 }}
              size="lg"
            >
              Cancel
            </Button>
            <Button onPress={handleSave} style={{ flex: 1 }} size="lg">
              Set date
            </Button>
          </View>
        </View>
      </BottomSheet>
    );
  },
);

DatePickerModal.displayName = 'DatePickerModal';

const styles = StyleSheet.create({
  content: {
    paddingBottom: 40,
    paddingHorizontal: 16,
  },
  header: {
    paddingBottom: 12,
    alignItems: 'center',
  },
  body: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
});
