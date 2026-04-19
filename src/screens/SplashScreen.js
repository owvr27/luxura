import { Pressable, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { theme } from '../theme';

export default function SplashScreen({ navigation }) {
  const { isLoggedIn, isPinRequired } = useAuth();
  const { t, textAlign } = useLanguage();

  return (
    <ScreenContainer>
      <View style={styles.card}>
        <View style={styles.badge}>
          <Text style={[styles.badgeText, { textAlign }]}>{t('screens.splash.badge')}</Text>
        </View>
        <Text style={[styles.title, { textAlign }]}>{t('screens.splash.title')}</Text>
        <Text style={[styles.description, { textAlign }]}>{t('screens.splash.description')}</Text>
        <Pressable
          onPress={() =>
            navigation.replace(
              isLoggedIn ? (isPinRequired ? 'PinLock' : 'MainApp') : 'Onboarding'
            )
          }
          style={styles.button}
        >
          <Text style={styles.buttonLabel}>{t('screens.splash.action')}</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    marginTop: theme.spacing.xl,
    padding: theme.spacing.xl,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 999,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  badgeText: {
    color: theme.colors.primaryStrong,
    fontSize: theme.typography.caption,
    fontWeight: '700',
  },
  title: {
    color: theme.colors.primaryStrong,
    fontSize: 34,
    fontWeight: '800',
    marginBottom: theme.spacing.sm,
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
    marginBottom: theme.spacing.lg,
  },
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    justifyContent: 'center',
    minHeight: 54,
    paddingHorizontal: theme.spacing.lg,
  },
  buttonLabel: {
    color: theme.colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
});
