import { Image } from 'expo-image';
import { Platform, StyleSheet, View } from 'react-native';

import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { Collapsible } from '@/components/ui/collapsible';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Text } from '@/components/ui/text';
import { useTheme } from '@/hooks/use-theme';

export default function TabTwoScreen() {
  const { typography } = useTheme();
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <View style={styles.titleContainer}>
        <Text
          variant="title"
          style={{
            fontFamily: typography.fonts.rounded,
          }}
        >
          Explore
        </Text>
      </View>
      <Text>This app includes example code to help you get started.</Text>
      <Collapsible title="File-based routing">
        <Text>
          This app has two screens:{' '}
          <Text variant="bodySemibold">app/(tabs)/index.tsx</Text> and{' '}
          <Text variant="bodySemibold">app/(tabs)/explore.tsx</Text>
        </Text>
        <Text>
          The layout file in{' '}
          <Text variant="bodySemibold">app/(tabs)/_layout.tsx</Text> sets up the
          tab navigator.
        </Text>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <Text style={{ color: '#0a7ea4', textDecorationLine: 'underline' }}>
            Learn more
          </Text>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Android, iOS, and web support">
        <Text>
          You can open this project on Android, iOS, and the web. To open the
          web version, press <Text variant="bodySemibold">w</Text> in the
          terminal running this project.
        </Text>
      </Collapsible>
      <Collapsible title="Images">
        <Text>
          For static images, you can use the{' '}
          <Text variant="bodySemibold">@2x</Text> and{' '}
          <Text variant="bodySemibold">@3x</Text> suffixes to provide files for
          different screen densities
        </Text>
        <Image
          source={require('@/assets/images/react-logo.png')}
          style={{ width: 100, height: 100, alignSelf: 'center' }}
        />
        <ExternalLink href="https://reactnative.dev/docs/images">
          <Text style={{ color: '#0a7ea4', textDecorationLine: 'underline' }}>
            Learn more
          </Text>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Light and dark mode components">
        <Text>
          This template has light and dark mode support. The{' '}
          <Text variant="bodySemibold">useColorScheme()</Text> hook lets you
          inspect what the user&apos;s current color scheme is, and so you can
          adjust UI colors accordingly.
        </Text>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <Text style={{ color: '#0a7ea4', textDecorationLine: 'underline' }}>
            Learn more
          </Text>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="Animations">
        <Text>
          This template includes an example of an animated component. The{' '}
          <Text variant="bodySemibold">components/HelloWave.tsx</Text> component
          uses the powerful{' '}
          <Text
            variant="bodySemibold"
            style={{ fontFamily: typography.fonts.mono }}
          >
            react-native-reanimated
          </Text>{' '}
          library to create a waving hand animation.
        </Text>
        {Platform.select({
          ios: (
            <Text>
              The{' '}
              <Text variant="bodySemibold">
                components/ParallaxScrollView.tsx
              </Text>{' '}
              component provides a parallax effect for the header image.
            </Text>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
