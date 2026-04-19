import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import AuthTextField from '../components/AuthTextField';
import { useHistory } from '../context/HistoryContext';
import ScreenContainer from '../components/ScreenContainer';
import { useLanguage } from '../context/LanguageContext';
import { mockVerificationCodes } from '../data/mockVerificationCodes';
import { theme } from '../theme';

function getScanResultText(t, isValid) {
  return isValid ? t('screens.verify.successMessage') : t('screens.verify.invalidMessage');
}

function getVerificationMatch(method, value, language) {
  const normalizedValue = String(value ?? '').trim().toUpperCase();
  const matchedEntry = mockVerificationCodes[method]?.[normalizedValue];

  if (!matchedEntry) {
    return null;
  }

  return {
    codeValue: normalizedValue,
    materialKey: matchedEntry.materialKey,
    points: matchedEntry.points,
    relatedBinName: matchedEntry.binName[language] ?? matchedEntry.binName.en,
  };
}

export default function VerifyScreen({ navigation }) {
  const { addHistoryItem } = useHistory();
  const { language, t, textAlign } = useLanguage();
  const [permission, requestPermission] = useCameraPermissions();
  const [hasScanned, setHasScanned] = useState(false);
  const [isSavingHistory, setIsSavingHistory] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [isSubmittingManual, setIsSubmittingManual] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  function getRelatedBinName(value) {
    if (value.includes('GREENBIN-VALID') || value.includes('GREENBIN-MANUAL-VALID')) {
      return language === 'ar' ? 'حاوية وسط البلد الذكية' : 'Downtown Smart Bin';
    }

    return '';
  }

  async function saveSuccessfulVerification({ method, points, relatedBinName, value, materialKey }) {
    setIsSavingHistory(true);
    await addHistoryItem({
      binName: relatedBinName,
      codeValue: value || '-',
      materialKey,
      method,
      points,
    });
    setIsSavingHistory(false);
  }

  const handleBarcodeScanned = async ({ data }) => {
    if (hasScanned) {
      return;
    }

    const normalizedValue = String(data ?? '').trim().toUpperCase();
    const match = getVerificationMatch('qr', normalizedValue, language);
    const isValid = Boolean(match);

    setHasScanned(true);
    setIsSavingHistory(false);
    setScanResult({
      isValid,
      historySaved: false,
      materialKey: match?.materialKey ?? '',
      points: match?.points ?? 0,
      relatedBinName: match?.relatedBinName ?? '',
      value: normalizedValue || '-',
    });

    if (isValid) {
      await saveSuccessfulVerification({
        method: 'qr',
        materialKey: match.materialKey,
        points: match.points,
        relatedBinName: match.relatedBinName,
        value: match.codeValue,
      });

      setScanResult({
        isValid,
        historySaved: true,
        materialKey: match.materialKey,
        points: match.points,
        relatedBinName: match.relatedBinName,
        value: match.codeValue,
      });
    }
  };

  async function handleManualSubmit() {
    if (isSubmittingManual) {
      return;
    }

    const normalizedValue = manualCode.trim().toUpperCase();
    const match = getVerificationMatch('manual', normalizedValue, language);
    const isValid = Boolean(match);

    setIsSubmittingManual(true);
    setIsSavingHistory(false);
    setScanResult({
      isValid,
      historySaved: false,
      materialKey: match?.materialKey ?? '',
      points: match?.points ?? 0,
      relatedBinName: match?.relatedBinName ?? '',
      value: normalizedValue || '-',
    });

    if (isValid) {
      await saveSuccessfulVerification({
        method: 'manual',
        materialKey: match.materialKey,
        points: match.points,
        relatedBinName: match.relatedBinName,
        value: match.codeValue,
      });

      setScanResult({
        isValid,
        historySaved: true,
        materialKey: match.materialKey,
        points: match.points,
        relatedBinName: match.relatedBinName,
        value: match.codeValue,
      });
    }

    setIsSubmittingManual(false);
  }

  const canScan = permission?.granted;

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.wrapper} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={[styles.title, { textAlign }]}>{t('screens.verify.title')}</Text>
          <Text style={[styles.description, { textAlign }]}>{t('screens.verify.description')}</Text>
          <Text style={[styles.helper, { textAlign }]}>{t('screens.verify.helper')}</Text>
        </View>

        <View style={styles.manualCard}>
          <Text style={[styles.manualTitle, { textAlign }]}>{t('screens.verify.manualTitle')}</Text>
          <Text style={[styles.manualDescription, { textAlign }]}>
            {t('screens.verify.manualDescription')}
          </Text>
          <AuthTextField
            autoCapitalize="characters"
            label={t('screens.verify.manualTitle')}
            onChangeText={setManualCode}
            placeholder={t('screens.verify.manualPlaceholder')}
            textAlign={textAlign}
            value={manualCode}
          />
          <Text style={[styles.manualHelper, { textAlign }]}>{t('screens.verify.manualHelper')}</Text>
          <Pressable
            disabled={isSubmittingManual}
            onPress={handleManualSubmit}
            style={[styles.primaryButton, isSubmittingManual && styles.buttonDisabled]}
          >
            {isSubmittingManual ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator color={theme.colors.textOnPrimary} size="small" />
                <Text style={styles.primaryButtonLabel}>{t('screens.verify.manualSubmitting')}</Text>
              </View>
            ) : (
              <Text style={styles.primaryButtonLabel}>{t('screens.verify.manualSubmit')}</Text>
            )}
          </Pressable>
        </View>

        {!canScan ? (
          <View style={styles.permissionCard}>
            <Text style={[styles.permissionTitle, { textAlign }]}>
              {t('screens.verify.permissionTitle')}
            </Text>
            <Text style={[styles.permissionDescription, { textAlign }]}>
              {t('screens.verify.permissionDescription')}
            </Text>
            <Pressable onPress={requestPermission} style={styles.primaryButton}>
              <Text style={styles.primaryButtonLabel}>{t('screens.verify.requestPermission')}</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.scannerCard}>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>
                {hasScanned ? t('screens.verify.readyLabel') : t('screens.verify.scanningLabel')}
              </Text>
            </View>

            <View style={styles.cameraFrame}>
              <CameraView
                barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
                onBarcodeScanned={hasScanned ? undefined : handleBarcodeScanned}
                style={StyleSheet.absoluteFillObject}
              />
              <View pointerEvents="none" style={styles.scanOverlay}>
                <View style={styles.scanWindow} />
              </View>
            </View>

            {scanResult ? (
              <View
                style={[
                  styles.resultCard,
                  scanResult.isValid ? styles.successCard : styles.errorCard,
                ]}
              >
                <Text
                  style={[
                    styles.resultTitle,
                    { textAlign },
                    scanResult.isValid ? styles.successText : styles.errorText,
                  ]}
                >
                  {scanResult.isValid
                    ? t('screens.verify.successTitle')
                    : t('screens.verify.invalidTitle')}
                </Text>
                <Text style={[styles.resultBody, { textAlign }]}>
                  {getScanResultText(t, scanResult.isValid)}
                </Text>
                {scanResult.isValid ? (
                  <>
                    <Text style={[styles.metaLabel, { textAlign }]}>
                      {t('screens.verify.materialLabel')}
                    </Text>
                    <Text style={[styles.metaValue, { textAlign }]}>
                      {t(`screens.verify.materials.${scanResult.materialKey}`)}
                    </Text>
                    <Text style={[styles.metaLabel, { textAlign }]}>
                      {t('screens.verify.pointsEarnedLabel')}
                    </Text>
                    <Text style={[styles.metaValue, { textAlign }]}>{scanResult.points}</Text>
                    <Text style={[styles.metaLabel, { textAlign }]}>
                      {t('screens.verify.relatedBinLabel')}
                    </Text>
                    <Text style={[styles.metaValue, { textAlign }]}>{scanResult.relatedBinName}</Text>
                  </>
                ) : null}
                {scanResult.isValid && isSavingHistory ? (
                  <Text style={[styles.historySavedText, { textAlign }]}>
                    {t('screens.verify.savingHistory')}
                  </Text>
                ) : null}
                {scanResult.isValid && scanResult.historySaved ? (
                  <Text style={[styles.historySavedText, { textAlign }]}>
                    {t('screens.verify.historySaved')}
                  </Text>
                ) : null}
                <Text style={[styles.scannedValueLabel, { textAlign }]}>
                  {t('screens.verify.scannedValueLabel')}
                </Text>
                <Text style={[styles.scannedValue, { textAlign }]}>{scanResult.value}</Text>
                {scanResult.isValid && scanResult.historySaved ? (
                  <Pressable
                    onPress={() => navigation.navigate('History')}
                    style={styles.historyButton}
                  >
                    <Text style={styles.historyButtonLabel}>{t('screens.verify.openHistory')}</Text>
                  </Pressable>
                ) : null}
              </View>
            ) : null}

            <Pressable
              onPress={() => {
                setHasScanned(false);
                setIsSavingHistory(false);
                setScanResult(null);
              }}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonLabel}>{t('screens.verify.scanAgain')}</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  heroCard: {
    backgroundColor: theme.colors.primarySurface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
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
    marginBottom: theme.spacing.sm,
  },
  helper: {
    color: theme.colors.primaryStrong,
    fontSize: theme.typography.caption,
    lineHeight: 18,
  },
  manualCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    padding: theme.spacing.lg,
  },
  manualTitle: {
    color: theme.colors.primaryStrong,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
  },
  manualDescription: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
    marginBottom: theme.spacing.sm,
  },
  manualHelper: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.caption,
    lineHeight: 18,
    marginBottom: theme.spacing.md,
  },
  permissionCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    padding: theme.spacing.lg,
  },
  permissionTitle: {
    color: theme.colors.primaryStrong,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
  },
  permissionDescription: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
    marginBottom: theme.spacing.lg,
  },
  scannerCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    padding: theme.spacing.lg,
    flex: 1,
  },
  statusPill: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 999,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  statusPillText: {
    color: theme.colors.primaryStrong,
    fontSize: theme.typography.caption,
    fontWeight: '700',
  },
  cameraFrame: {
    backgroundColor: '#0F1F16',
    borderRadius: theme.radius.lg,
    height: 300,
    overflow: 'hidden',
    position: 'relative',
  },
  scanOverlay: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  scanWindow: {
    borderColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 3,
    height: 180,
    width: 180,
  },
  resultCard: {
    borderRadius: theme.radius.lg,
    marginTop: theme.spacing.md,
    padding: theme.spacing.md,
  },
  successCard: {
    backgroundColor: theme.colors.primarySoft,
  },
  errorCard: {
    backgroundColor: '#FDECEC',
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  successText: {
    color: theme.colors.primaryStrong,
  },
  errorText: {
    color: theme.colors.danger,
  },
  resultBody: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: theme.spacing.sm,
  },
  metaLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.caption,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  metaValue: {
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: theme.spacing.sm,
  },
  historySavedText: {
    color: theme.colors.primaryStrong,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    marginBottom: theme.spacing.sm,
  },
  scannedValueLabel: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.caption,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  scannedValue: {
    color: theme.colors.text,
    fontSize: 14,
    lineHeight: 20,
  },
  historyButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.md,
    justifyContent: 'center',
    marginTop: theme.spacing.md,
    minHeight: 44,
    paddingHorizontal: theme.spacing.md,
  },
  historyButtonLabel: {
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
  secondaryButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.borderStrong,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: theme.spacing.md,
    minHeight: 52,
    paddingHorizontal: theme.spacing.lg,
  },
  secondaryButtonLabel: {
    color: theme.colors.primaryStrong,
    fontSize: 15,
    fontWeight: '700',
  },
});
