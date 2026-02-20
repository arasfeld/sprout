import React, { useRef } from 'react';
import { StyleSheet } from 'react-native';

import { formatDateTimeHuman } from '@/utils/date';

import { Button } from './button';
import { DatePickerModal, type DatePickerModalRef } from './date-picker-modal';
import { Field, FieldContent, FieldLabel } from './field';

interface DateTimeFieldProps {
  label: string;
  value: Date | null;
  onSave: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
  placeholder?: string;
}

export function DateTimeField({
  label,
  value,
  onSave,
  mode = 'datetime',
  placeholder = 'Select',
}: DateTimeFieldProps) {
  const datePickerRef = useRef<DatePickerModalRef>(null);

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      <FieldContent>
        <Button
          variant="secondary"
          onPress={() => datePickerRef.current?.open()}
          style={styles.datePickerButton}
        >
          {value ? formatDateTimeHuman(value) : placeholder}
        </Button>
        <DatePickerModal
          ref={datePickerRef}
          value={value ?? new Date()}
          mode={mode}
          title={`Select ${label}`}
          onSave={onSave}
          onClose={() => {}}
        />
      </FieldContent>
    </Field>
  );
}

const styles = StyleSheet.create({
  datePickerButton: {
    justifyContent: 'flex-start',
    paddingHorizontal: 12,
  },
});
