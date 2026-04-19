import { ScrollView, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { useAuth } from '../context/AuthContext';
import { useHistory } from '../context/HistoryContext';
import { useLanguage } from '../context/LanguageContext';
import { theme } from '../theme';

function EducationalCard({ badge, title, body, highlights, textAlign }) {
  return (
    <View style={styles.educationCard}>
      <Text style={[styles.educationBadge, { textAlign }]}>{badge}</Text>
      <Text style={[styles.educationTitle, { textAlign }]}>{title}</Text>
      <Text style={[styles.educationBody, { textAlign }]}>{body}</Text>
      <View style={styles.highlightList}>
        {highlights.map((item) => (
          <View key={item} style={styles.highlightRow}>
            <View style={styles.highlightDot} />
            <Text style={[styles.highlightText, { textAlign }]}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const { currentUser } = useAuth();
  const { historyItems } = useHistory();
  const { t, textAlign } = useLanguage();
  const totalPoints = historyItems.reduce((sum, item) => sum + (item.points ?? 0), 0);
  const educationalSections = [
    {
      badge: t('screens.home.systemBadge'),
      title: t('screens.home.systemTitle'),
      body: t('screens.home.systemBody'),
      highlights: [
        t('screens.home.systemPointOne'),
        t('screens.home.systemPointTwo'),
        t('screens.home.systemPointThree'),
      ],
    },
    {
      badge: t('screens.home.cleanlinessBadge'),
      title: t('screens.home.cleanlinessTitle'),
      body: t('screens.home.cleanlinessBody'),
      highlights: [
        t('screens.home.cleanlinessPointOne'),
        t('screens.home.cleanlinessPointTwo'),
        t('screens.home.cleanlinessPointThree'),
      ],
    },
    {
      badge: t('screens.home.recyclingBadge'),
      title: t('screens.home.recyclingTitle'),
      body: t('screens.home.recyclingBody'),
      highlights: [
        t('screens.home.recyclingPointOne'),
        t('screens.home.recyclingPointTwo'),
        t('screens.home.recyclingPointThree'),
      ],
    },
  ];

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <Text style={[styles.badge, { textAlign }]}>{t('screens.home.badge')}</Text>
          <Text style={[styles.welcomeText, { textAlign }]}>
            {t('screens.home.welcomeTitle')}, {currentUser?.fullName ?? '-'}
          </Text>
          <Text style={[styles.title, { textAlign }]}>{t('screens.home.title')}</Text>
          <Text style={[styles.description, { textAlign }]}>{t('screens.home.description')}</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryChip}>
              <Text style={[styles.summaryChipLabel, { textAlign }]}>{t('screens.home.summaryPoints')}</Text>
              <Text style={[styles.summaryChipValue, { textAlign }]}>{totalPoints}</Text>
            </View>
            <View style={styles.summaryChip}>
              <Text style={[styles.summaryChipLabel, { textAlign }]}>{t('screens.home.summaryHistory')}</Text>
              <Text style={[styles.summaryChipValue, { textAlign }]}>{historyItems.length}</Text>
            </View>
          </View>
        </View>

        <View style={styles.overviewCard}>
          <Text style={[styles.overviewTitle, { textAlign }]}>{t('screens.home.overviewTitle')}</Text>
          <Text style={[styles.overviewBody, { textAlign }]}>{t('screens.home.overviewBody')}</Text>
        </View>

        {educationalSections.map((section) => (
          <EducationalCard
            key={section.title}
            badge={section.badge}
            body={section.body}
            highlights={section.highlights}
            textAlign={textAlign}
            title={section.title}
          />
        ))}
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
  welcomeText: {
    color: theme.colors.primaryStrong,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  summaryChip: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    flex: 1,
    padding: theme.spacing.sm,
  },
  summaryChipLabel: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  summaryChipValue: {
    color: theme.colors.primaryStrong,
    fontSize: 18,
    fontWeight: '800',
  },
  overviewCard: {
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
  overviewTitle: {
    color: theme.colors.primaryStrong,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
  },
  overviewBody: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  educationCard: {
    backgroundColor: theme.colors.surfaceMuted,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.xl,
    borderWidth: 1,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  educationBadge: {
    color: theme.colors.primaryStrong,
    fontSize: theme.typography.caption,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
  },
  educationTitle: {
    color: theme.colors.primaryStrong,
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
    marginBottom: theme.spacing.sm,
  },
  educationBody: {
    color: theme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 24,
  },
  highlightList: {
    marginTop: theme.spacing.md,
    rowGap: theme.spacing.sm,
  },
  highlightRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  highlightDot: {
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
    height: 10,
    marginTop: 7,
    width: 10,
  },
  highlightText: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
  },
});
