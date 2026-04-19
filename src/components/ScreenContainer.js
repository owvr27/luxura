import { SafeAreaView, StyleSheet, View } from 'react-native';
import { theme } from '../theme';

export default function ScreenContainer({ children }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    padding: theme.spacing.lg,
  },
});
