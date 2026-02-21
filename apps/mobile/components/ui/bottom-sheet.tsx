import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  type BottomSheetModalProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { StyleSheet } from 'react-native';

import { useTheme } from '@/hooks/use-theme';

export type BottomSheetRef = {
  open: () => void;
  close: () => void;
};

interface Props extends Partial<BottomSheetModalProps> {
  children: React.ReactNode;
  snapPoints?: string[] | number[];
}

export const BottomSheet = forwardRef<BottomSheetRef, Props>(
  ({ children, snapPoints, ...props }, ref) => {
    const { colors } = useTheme();
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);

    useImperativeHandle(ref, () => ({
      open() {
        bottomSheetModalRef.current?.present();
      },
      close() {
        bottomSheetModalRef.current?.dismiss();
      },
    }));

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.5}
          pressBehavior="close"
        />
      ),
      [],
    );

    // If no snapPoints provided, we'll use dynamic sizing
    const enableDynamicSizing = !snapPoints;

    return (
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={snapPoints}
        enableDynamicSizing={enableDynamicSizing}
        backdropComponent={renderBackdrop}
        backgroundStyle={{ backgroundColor: colors.background }}
        handleIndicatorStyle={{ backgroundColor: colors.border }}
        {...props}
      >
        {/* We use BottomSheetView to support dynamic sizing if no snapPoints provided */}
        {enableDynamicSizing ? (
          <BottomSheetView style={styles.contentContainer}>
            {children}
          </BottomSheetView>
        ) : (
          children
        )}
      </BottomSheetModal>
    );
  },
);

BottomSheet.displayName = 'BottomSheet';

export { BottomSheetFlatList };

const styles = StyleSheet.create({
  contentContainer: {
    minHeight: 100,
    paddingBottom: 20,
  },
});
