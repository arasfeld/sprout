import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';

export default function ModalScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text variant="title">This is a modal</Text>
      <Button variant="link" onPress={() => router.push('/')}>
        Go to home screen
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});
