import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AuthTextField from '../components/AuthTextField';
import { useAuth } from '../context/AuthContext';
import ScreenContainer from '../components/ScreenContainer';
import { useLanguage } from '../context/LanguageContext';
import { theme } from '../theme';
import { validateEmail, validatePassword } from '../utils/authValidation';

export default function LoginScreen({ navigation }) {
  const { loginUser } = useAuth();
  const { rowDirection, t, textAlign } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function getErrorMessage(key) {
    return key ? t(`validation.${key}`) : '';
  }

  async function handleSubmit() {
    if (isSubmitting) {
      return;
    }

    const nextErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };

    setErrors(nextErrors);

    const hasErrors = Object.values(nextErrors).some(Boolean);

    if (hasErrors) {
      setAuthError('');
      return;
    }

    setIsSubmitting(true);
    const result = await loginUser({ email, password });
    setIsSubmitting(false);

    if (!result.ok) {
      setAuthError(t(`screens.login.${result.error}`));
      return;
    }

    setAuthError('');
    navigation.reset({
      index: 0,
      routes: [{ name: 'MainApp' }],
    });
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={[styles.badge, { textAlign }]}>{t('screens.login.badge')}</Text>
          <Text style={[styles.title, { textAlign }]}>{t('screens.login.title')}</Text>
          <Text style={[styles.description, { textAlign }]}>{t('screens.login.description')}</Text>
        </View>

        <View style={styles.formCard}>
          <AuthTextField
            autoCapitalize="none"
            error={getErrorMessage(errors.email)}
            keyboardType="email-address"
            label={t('common.email')}
            onChangeText={setEmail}
            placeholder={t('screens.login.emailPlaceholder')}
            textAlign={textAlign}
            value={email}
          />
          <AuthTextField
            error={getErrorMessage(errors.password)}
            label={t('common.password')}
            onChangeText={setPassword}
            placeholder={t('screens.login.passwordPlaceholder')}
            secureTextEntry
            textAlign={textAlign}
            value={password}
          />

          <Text style={[styles.helper, { textAlign }]}>{t('screens.login.helper')}</Text>

          {authError ? (
            <View style={styles.errorBox}>
              <Text style={[styles.errorBoxText, { textAlign }]}>{authError}</Text>
            </View>
          ) : null}

          <Pressable
            disabled={isSubmitting}
            onPress={handleSubmit}
            style={[styles.primaryButton, isSubmitting && styles.buttonDisabled]}
          >
            {isSubmitting ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator color={theme.colors.textOnPrimary} size="small" />
                <Text style={styles.primaryButtonLabel}>{t('screens.login.submitting')}</Text>
              </View>
            ) : (
              <Text style={styles.primaryButtonLabel}>{t('screens.login.submit')}</Text>
            )}
          </Pressable>

          <View style={[styles.linkRow, { flexDirection: rowDirection }]}>
            <Text style={[styles.linkLead, { textAlign }]}>{t('screens.login.noAccount')}</Text>
            <Pressable onPress={() => navigation.navigate('Register')}>
              <Text style={[styles.linkText, { textAlign }]}>
                {t('screens.login.createAccountLink')}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: theme.spacing.xl,
  },
  heroCard: {
    backgroundColor: theme.colors.primarySurface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
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
    lineHeight: 34,
    marginBottom: theme.spacing.sm,
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  formCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  helper: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: theme.spacing.md,
  },
  errorBox: {
    backgroundColor: '#FDECEC',
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  errorBoxText: {
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
  linkRow: {
    alignItems: 'center',
    columnGap: theme.spacing.xs,
    justifyContent: 'center',
    marginTop: theme.spacing.md,
    rowGap: theme.spacing.xs,
    flexWrap: 'wrap',
  },
  linkLead: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  linkText: {
    color: theme.colors.primaryStrong,
    fontSize: 14,
    fontWeight: '700',
  },
});
