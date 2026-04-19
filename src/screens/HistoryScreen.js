import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { useHistory } from '../context/HistoryContext';
import { useLanguage } from '../context/LanguageContext';
import { theme } from '../theme';

function formatHistoryDate(isoDate, language) {
  const locale = language === 'ar' ? 'ar-EG' : 'en-US';

  return new Date(isoDate).toLocaleString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function HistoryMetaRow({ label, value, textAlign }) {
  if (!value) {
    return null;
  }

  return (
    <View style={styles.metaRow}>
      <Text style={[styles.metaLabel, { textAlign }]}>{label}</Text>
      <Text style={[styles.metaValue, { textAlign }]}>{value}</Text>
    </View>
  );
}

export default function HistoryScreen({ navigation }) {
  const { historyItems, isHistoryHydrated } = useHistory();
  const { language, t, textAlign } = useLanguage();

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={[styles.title, { textAlign }]}>{t('screens.history.title')}</Text>
          <Text style={[styles.description, { textAlign }]}>
            {t('screens.history.description')}
          </Text>
        </View>

        {!isHistoryHydrated ? (
          <View style={styles.stateCard}>
            <ActivityIndicator color={theme.colors.primaryStrong} />
          </View>
        ) : historyItems.length === 0 ? (
          <View style={styles.stateCard}>
            <Text style={[styles.emptyTitle, { textAlign }]}>{t('screens.history.emptyTitle')}</Text>
            <Text style={[styles.emptyBody, { textAlign }]}>{t('screens.history.emptyBody')}</Text>
            <Pressable onPress={() => navigation.navigate('Verify')} style={styles.emptyButton}>
              <Text style={styles.emptyButtonLabel}>{t('screens.history.emptyAction')}</Text>
            </Pressable>
          </View>
        ) : (
          historyItems.map((item) => (
            <View key={item.id} style={styles.historyCard}>
              <View style={styles.cardHeader}>
                <Text style={[styles.pointsText, { textAlign }]}>
                  +{item.points} {t('screens.history.pointsLabel')}
                </Text>
                <Text style={[styles.dateText, { textAlign }]}>
                  {formatHistoryDate(item.createdAt, language)}
                </Text>
              </View>

              <HistoryMetaRow
                label={t('screens.history.methodLabel')}
                textAlign={textAlign}
                value={
                  item.method === 'qr'
                    ? t('screens.history.methodQr')
                    : t('screens.history.methodManual')
                }
              />
              <HistoryMetaRow
                label={t('screens.history.materialLabel')}
                textAlign={textAlign}
                value={item.materialKey ? t(`screens.verify.materials.${item.materialKey}`) : ''}
              />
              <HistoryMetaRow
                label={t('screens.history.binLabel')}
                textAlign={textAlign}
                value={item.binName}
              />
              <HistoryMetaRow
                label={t('screens.history.codeLabel')}
                textAlign={textAlign}
                value={item.codeValue}
              />
            </View>
          ))
        )}
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
  stateCard: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 180,
    padding: theme.spacing.lg,
  },
  emptyTitle: {
    color: theme.colors.primaryStrong,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
  },
  emptyBody: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
    marginBottom: theme.spacing.md,
  },
  emptyButton: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    justifyContent: 'center',
    minHeight: 50,
    paddingHorizontal: theme.spacing.lg,
  },
  emptyButtonLabel: {
    color: theme.colors.textOnPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  historyCard: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    marginBottom: theme.spacing.sm,
  },
  pointsText: {
    color: theme.colors.primaryStrong,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: theme.spacing.xs,
  },
  dateText: {
    color: theme.colors.textSecondary,
    fontSize: 13,
  },
  metaRow: {
    marginTop: theme.spacing.sm,
  },
  metaLabel: {
    color: theme.colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 2,
  },
  metaValue: {
    color: theme.colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
});
