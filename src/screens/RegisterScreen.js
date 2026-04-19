import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AuthTextField from '../components/AuthTextField';
import { useAuth } from '../context/AuthContext';
import ScreenContainer from '../components/ScreenContainer';
import { useLanguage } from '../context/LanguageContext';
import { theme } from '../theme';
import {
  validateConfirmPassword,
  validateEmail,
  validateFullName,
  validatePassword,
} from '../utils/authValidation';

export default function RegisterScreen({ navigation }) {
  const { registerUser } = useAuth();
  const { rowDirection, t, textAlign } = useLanguage();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function getErrorMessage(key) {
    return key ? t(`validation.${key}`) : '';
  }

  async function handleSubmit() {
    if (isSubmitting) {
      return;
    }

    const nextErrors = {
      fullName: validateFullName(fullName),
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
    };

    setErrors(nextErrors);

    const hasErrors = Object.values(nextErrors).some(Boolean);

    if (hasErrors) {
      setAuthError('');
      setSuccessMessage('');
      return;
    }

    setIsSubmitting(true);
    const result = await registerUser({ email, fullName, password });
    setIsSubmitting(false);

    if (!result.ok) {
      setAuthError(t(`screens.register.${result.error}`));
      setSuccessMessage('');
      return;
    }

    setAuthError('');
    setSuccessMessage(t('screens.register.success'));
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={[styles.badge, { textAlign }]}>{t('screens.register.badge')}</Text>
          <Text style={[styles.title, { textAlign }]}>{t('screens.register.title')}</Text>
          <Text style={[styles.description, { textAlign }]}>
            {t('screens.register.description')}
          </Text>
        </View>

        <View style={styles.formCard}>
          <AuthTextField
            autoCapitalize="words"
            error={getErrorMessage(errors.fullName)}
            label={t('common.fullName')}
            onChangeText={setFullName}
            placeholder={t('screens.register.fullNamePlaceholder')}
            textAlign={textAlign}
            value={fullName}
          />
          <AuthTextField
            autoCapitalize="none"
            error={getErrorMessage(errors.email)}
            keyboardType="email-address"
            label={t('common.email')}
            onChangeText={setEmail}
            placeholder={t('screens.register.emailPlaceholder')}
            textAlign={textAlign}
            value={email}
          />
          <AuthTextField
            error={getErrorMessage(errors.password)}
            label={t('common.password')}
            onChangeText={setPassword}
            placeholder={t('screens.register.passwordPlaceholder')}
            secureTextEntry
            textAlign={textAlign}
            value={password}
          />
          <AuthTextField
            error={getErrorMessage(errors.confirmPassword)}
            label={t('common.confirmPassword')}
            onChangeText={setConfirmPassword}
            placeholder={t('screens.register.confirmPasswordPlaceholder')}
            secureTextEntry
            textAlign={textAlign}
            value={confirmPassword}
          />

          <Text style={[styles.helper, { textAlign }]}>{t('screens.register.helper')}</Text>

          {authError ? (
            <View style={styles.errorBox}>
              <Text style={[styles.errorBoxText, { textAlign }]}>{authError}</Text>
            </View>
          ) : null}

          {successMessage ? (
            <View style={styles.successBox}>
              <Text style={[styles.successText, { textAlign }]}>{successMessage}</Text>
              <Pressable
                onPress={() =>
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  })
                }
                style={styles.successButton}
              >
                <Text style={styles.successButtonLabel}>{t('screens.register.continueToLogin')}</Text>
              </Pressable>
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
                <Text style={styles.primaryButtonLabel}>{t('screens.register.submitting')}</Text>
              </View>
            ) : (
              <Text style={styles.primaryButtonLabel}>{t('screens.register.submit')}</Text>
            )}
          </Pressable>

          <View style={[styles.linkRow, { flexDirection: rowDirection }]}>
            <Text style={[styles.linkLead, { textAlign }]}>{t('screens.register.haveAccount')}</Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.linkText, { textAlign }]}>{t('screens.register.loginLink')}</Text>
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
  successBox: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: theme.radius.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  successText: {
    color: theme.colors.primaryStrong,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  successButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    minHeight: 44,
    paddingHorizontal: theme.spacing.md,
  },
  successButtonLabel: {
    color: theme.colors.textOnPrimary,
    fontSize: 14,
    fontWeight: '700',
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
