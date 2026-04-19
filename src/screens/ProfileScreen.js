import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AuthTextField from '../components/AuthTextField';
import ScreenContainer from '../components/ScreenContainer';
import { useAuth } from '../context/AuthContext';
import { useHistory } from '../context/HistoryContext';
import { useLanguage } from '../context/LanguageContext';
import { theme } from '../theme';
import { validateFullName } from '../utils/authValidation';

export default function ProfileScreen({ navigation }) {
  const {
    appLockEnabled,
    currentUser,
    hasPinConfigured,
    logoutUser,
    saveAppLockSettings,
    updateProfile,
  } = useAuth();
  const { historyItems } = useHistory();
  const { rowDirection, t, textAlign } = useLanguage();
  const [fullName, setFullName] = useState(currentUser?.fullName ?? '');
  const [nameError, setNameError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [pinConfirm, setPinConfirm] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinMessage, setPinMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingPin, setIsSavingPin] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    setFullName(currentUser?.fullName ?? '');
  }, [currentUser?.fullName]);

  const totalPoints = useMemo(
    () => historyItems.reduce((sum, item) => sum + (item.points ?? 0), 0),
    [historyItems]
  );

  async function handleSaveProfile() {
    if (isSaving) {
      return;
    }

    const errorKey = validateFullName(fullName);

    if (errorKey) {
      setNameError(t(`validation.${errorKey}`));
      setSaveMessage('');
      return;
    }

    setIsSaving(true);
    await updateProfile({ fullName });
    setIsSaving(false);
    setNameError('');
    setSaveMessage(t('screens.profile.saveSuccess'));
  }

  async function handleSavePinSettings() {
    if (isSavingPin) {
      return;
    }

    if (!appLockEnabled && pinCode.trim().length !== 4) {
      setPinError(t('screens.profile.pinValidation'));
      setPinMessage('');
      return;
    }

    if (!appLockEnabled && pinCode.trim() !== pinConfirm.trim()) {
      setPinError(t('screens.profile.pinMismatch'));
      setPinMessage('');
      return;
    }

    setIsSavingPin(true);

    if (appLockEnabled) {
      await saveAppLockSettings({ enabled: false, pinCode: '' });
      setPinCode('');
      setPinConfirm('');
      setPinError('');
      setPinMessage(t('screens.profile.pinDisabled'));
      setIsSavingPin(false);
      return;
    }

    await saveAppLockSettings({
      enabled: true,
      pinCode: pinCode.trim(),
    });

    setPinCode('');
    setPinConfirm('');
    setPinError('');
    setPinMessage(t('screens.profile.pinSaved'));
    setIsSavingPin(false);
  }

  async function handleLogout() {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    await logoutUser();
    navigation.getParent()?.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={[styles.title, { textAlign }]}>{t('screens.profile.title')}</Text>
          <Text style={[styles.description, { textAlign }]}>
            {t('screens.profile.description')}
          </Text>
        </View>

        <View style={styles.summaryCard}>
          <View style={[styles.summaryRow, { flexDirection: rowDirection }]}>
            <View style={styles.summaryBlock}>
              <Text style={[styles.summaryLabel, { textAlign }]}>
                {t('screens.profile.userNameLabel')}
              </Text>
              <Text style={[styles.summaryValue, { textAlign }]}>
                {currentUser?.fullName ?? '-'}
              </Text>
            </View>
            <View style={styles.summaryBlock}>
              <Text style={[styles.summaryLabel, { textAlign }]}>
                {t('screens.profile.totalPointsLabel')}
              </Text>
              <Text style={[styles.summaryValue, { textAlign }]}>{totalPoints}</Text>
            </View>
          </View>

          <View style={styles.emailBlock}>
            <Text style={[styles.summaryLabel, { textAlign }]}>
              {t('screens.profile.emailLabel')}
            </Text>
            <Text style={[styles.emailValue, { textAlign }]}>{currentUser?.email ?? '-'}</Text>
          </View>
        </View>

        <View style={styles.editCard}>
          <Text style={[styles.editTitle, { textAlign }]}>{t('screens.profile.editTitle')}</Text>
          <AuthTextField
            autoCapitalize="words"
            error={nameError}
            label={t('common.fullName')}
            onChangeText={setFullName}
            placeholder={t('screens.profile.fullNamePlaceholder')}
            textAlign={textAlign}
            value={fullName}
          />

          {saveMessage ? (
            <View style={styles.successBox}>
              <Text style={[styles.successText, { textAlign }]}>{saveMessage}</Text>
            </View>
          ) : null}

          <Pressable
            disabled={isSaving}
            onPress={handleSaveProfile}
            style={[styles.primaryButton, isSaving && styles.buttonDisabled]}
          >
            {isSaving ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator color={theme.colors.textOnPrimary} size="small" />
                <Text style={styles.primaryButtonLabel}>{t('screens.profile.saving')}</Text>
              </View>
            ) : (
              <Text style={styles.primaryButtonLabel}>{t('screens.profile.saveButton')}</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.editCard}>
          <Text style={[styles.editTitle, { textAlign }]}>{t('screens.profile.securityTitle')}</Text>
          <Text style={[styles.securityDescription, { textAlign }]}>
            {t('screens.profile.securityDescription')}
          </Text>
          <View style={styles.securityStatusBox}>
            <Text style={[styles.securityStatusLabel, { textAlign }]}>
              {t('screens.profile.securityStatusLabel')}
            </Text>
            <Text style={[styles.securityStatusValue, { textAlign }]}>
              {appLockEnabled
                ? t('screens.profile.securityEnabled')
                : t('screens.profile.securityDisabled')}
            </Text>
            {hasPinConfigured ? (
              <Text style={[styles.securityHint, { textAlign }]}>
                {t('screens.profile.securityHint')}
              </Text>
            ) : null}
          </View>

          {!appLockEnabled ? (
            <>
              <AuthTextField
                keyboardType="number-pad"
                label={t('screens.profile.pinLabel')}
                maxLength={4}
                onChangeText={(value) => {
                  setPinCode(value.replace(/[^0-9]/g, ''));
                  setPinError('');
                  setPinMessage('');
                }}
                placeholder={t('screens.profile.pinPlaceholder')}
                secureTextEntry
                textAlign={textAlign}
                value={pinCode}
              />
              <AuthTextField
                keyboardType="number-pad"
                label={t('screens.profile.pinConfirmLabel')}
                maxLength={4}
                onChangeText={(value) => {
                  setPinConfirm(value.replace(/[^0-9]/g, ''));
                  setPinError('');
                  setPinMessage('');
                }}
                placeholder={t('screens.profile.pinConfirmPlaceholder')}
                secureTextEntry
                textAlign={textAlign}
                value={pinConfirm}
              />
            </>
          ) : null}

          {pinError ? (
            <View style={styles.errorBox}>
              <Text style={[styles.errorText, { textAlign }]}>{pinError}</Text>
            </View>
          ) : null}

          {pinMessage ? (
            <View style={styles.successBox}>
              <Text style={[styles.successText, { textAlign }]}>{pinMessage}</Text>
            </View>
          ) : null}

          <Pressable
            disabled={isSavingPin}
            onPress={handleSavePinSettings}
            style={[
              appLockEnabled ? styles.secondaryButton : styles.primaryButton,
              isSavingPin && styles.buttonDisabled,
            ]}
          >
            {isSavingPin ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator
                  color={appLockEnabled ? theme.colors.primaryStrong : theme.colors.textOnPrimary}
                  size="small"
                />
                <Text
                  style={[
                    appLockEnabled ? styles.secondaryButtonLabel : styles.primaryButtonLabel,
                  ]}
                >
                  {t('screens.profile.securitySaving')}
                </Text>
              </View>
            ) : (
              <Text style={appLockEnabled ? styles.secondaryButtonLabel : styles.primaryButtonLabel}>
                {appLockEnabled
                  ? t('screens.profile.disablePinButton')
                  : t('screens.profile.enablePinButton')}
              </Text>
            )}
          </Pressable>
        </View>

        <Pressable
          disabled={isLoggingOut}
          onPress={handleLogout}
          style={[styles.logoutButton, isLoggingOut && styles.buttonDisabled]}
        >
          {isLoggingOut ? (
            <View style={styles.buttonContent}>
              <ActivityIndicator color={theme.colors.danger} size="small" />
              <Text style={styles.logoutButtonLabel}>{t('screens.profile.loggingOut')}</Text>
            </View>
          ) : (
            <Text style={styles.logoutButtonLabel}>{t('screens.profile.logoutButton')}</Text>
          )}
        </Pressable>
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
  summaryCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  summaryRow: {
    gap: theme.spacing.md,
  },
  summaryBlock: {
    flex: 1,
  },
  summaryLabel: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  summaryValue: {
    color: theme.colors.primaryStrong,
    fontSize: 20,
    fontWeight: '800',
  },
  emailBlock: {
    marginTop: theme.spacing.lg,
  },
  emailValue: {
    color: theme.colors.text,
    fontSize: 16,
    lineHeight: 22,
  },
  editCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  editTitle: {
    color: theme.colors.primaryStrong,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: theme.spacing.md,
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
  securityDescription: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginBottom: theme.spacing.md,
  },
  securityStatusBox: {
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.md,
  },
  securityStatusLabel: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  securityStatusValue: {
    color: theme.colors.primaryStrong,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  securityHint: {
    color: theme.colors.textSecondary,
    fontSize: 13,
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
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 54,
    paddingHorizontal: theme.spacing.lg,
  },
  secondaryButtonLabel: {
    color: theme.colors.primaryStrong,
    fontSize: 16,
    fontWeight: '700',
  },
  logoutButton: {
    alignItems: 'center',
    backgroundColor: '#FDECEC',
    borderColor: '#F3C8C8',
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 54,
    paddingHorizontal: theme.spacing.lg,
  },
  logoutButtonLabel: {
    color: theme.colors.danger,
    fontSize: 16,
    fontWeight: '700',
  },
});
