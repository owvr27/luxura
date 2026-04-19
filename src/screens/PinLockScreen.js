import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import AuthTextField from '../components/AuthTextField';
import ScreenContainer from '../components/ScreenContainer';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { theme } from '../theme';

export default function PinLockScreen({ navigation }) {
  const { unlockWithPin } = useAuth();
  const { t, textAlign } = useLanguage();
  const [pinCode, setPinCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);

  async function handleUnlock() {
    if (isUnlocking) {
      return;
    }

    if (pinCode.trim().length !== 4) {
      setErrorMessage(t('screens.pinLock.pinValidation'));
      return;
    }

    setIsUnlocking(true);
    const result = await unlockWithPin(pinCode.trim());
    setIsUnlocking(false);

    if (!result.ok) {
      setErrorMessage(t('screens.pinLock.invalidPin'));
      return;
    }

    setErrorMessage('');
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainApp' }],
    });
  }

  return (
    <ScreenContainer>
      <View style={styles.wrapper}>
        <View style={styles.card}>
          <Text style={[styles.badge, { textAlign }]}>{t('screens.pinLock.badge')}</Text>
          <Text style={[styles.title, { textAlign }]}>{t('screens.pinLock.title')}</Text>
          <Text style={[styles.description, { textAlign }]}>{t('screens.pinLock.description')}</Text>

          <AuthTextField
            keyboardType="number-pad"
            label={t('screens.pinLock.pinLabel')}
            maxLength={4}
            onChangeText={(value) => {
              setPinCode(value.replace(/[^0-9]/g, ''));
              setErrorMessage('');
            }}
            placeholder={t('screens.pinLock.pinPlaceholder')}
            secureTextEntry
            textAlign={textAlign}
            value={pinCode}
          />

          {errorMessage ? (
            <View style={styles.errorBox}>
              <Text style={[styles.errorText, { textAlign }]}>{errorMessage}</Text>
            </View>
          ) : null}

          <Pressable
            disabled={isUnlocking}
            onPress={handleUnlock}
            style={[styles.primaryButton, isUnlocking && styles.buttonDisabled]}
          >
            {isUnlocking ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator color={theme.colors.textOnPrimary} size="small" />
                <Text style={styles.primaryButtonLabel}>{t('screens.pinLock.unlocking')}</Text>
              </View>
            ) : (
              <Text style={styles.primaryButtonLabel}>{t('screens.pinLock.unlockButton')}</Text>
            )}
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    padding: theme.spacing.xl,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  badge: {
    color: theme.colors.primaryStrong,
    fontSize: theme.typography.caption,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
  },
  title: {
    color: theme.colors.primaryStrong,
    fontSize: 28,
    fontWeight: '800',
    marginBottom: theme.spacing.sm,
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
    marginBottom: theme.spacing.lg,
  },
  errorBox: {
    backgroundColor: '#FDECEC',
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    justifyContent: 'center',
    minHeight: 54,
    paddingHorizontal: theme.spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.75,
  },
  buttonContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  primaryButtonLabel: {
    color: theme.colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
});
