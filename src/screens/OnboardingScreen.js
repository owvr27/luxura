import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { useLanguage } from '../context/LanguageContext';
import { theme } from '../theme';

function AwarenessCard({ title, body, points, rowDirection, textAlign }) {
  return (
    <View style={styles.card}>
      <Text style={[styles.cardTitle, { textAlign }]}>{title}</Text>
      <Text style={[styles.cardBody, { textAlign }]}>{body}</Text>
      <View style={styles.pointList}>
        {points.map((point) => (
          <View key={point} style={[styles.pointRow, { flexDirection: rowDirection }]}>
            <View style={styles.pointDot} />
            <Text style={[styles.pointText, { textAlign }]}>{point}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function OnboardingScreen({ navigation }) {
  const { rowDirection, t, textAlign } = useLanguage();

  const awarenessSections = [
    {
      title: t('screens.onboarding.rewardTitle'),
      body: t('screens.onboarding.rewardBody'),
      points: [
        t('screens.onboarding.rewardPointOne'),
        t('screens.onboarding.rewardPointTwo'),
      ],
    },
    {
      title: t('screens.onboarding.classificationTitle'),
      body: t('screens.onboarding.classificationBody'),
      points: [
        t('screens.onboarding.classificationPointOne'),
        t('screens.onboarding.classificationPointTwo'),
        t('screens.onboarding.classificationPointThree'),
      ],
    },
    {
      title: t('screens.onboarding.cleanlinessTitle'),
      body: t('screens.onboarding.cleanlinessBody'),
      points: [
        t('screens.onboarding.cleanlinessPointOne'),
        t('screens.onboarding.cleanlinessPointTwo'),
      ],
    },
  ];

  return (
    <ScreenContainer>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.heroGlowLarge} />
          <View style={styles.heroGlowSmall} />
          <Text style={[styles.eyebrow, { textAlign }]}>{t('screens.onboarding.heroEyebrow')}</Text>
          <Text style={[styles.title, { textAlign }]}>{t('screens.onboarding.title')}</Text>
          <Text style={[styles.description, { textAlign }]}>
            {t('screens.onboarding.description')}
          </Text>
          <View style={[styles.heroBadgeRow, { flexDirection: rowDirection }]}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{t('common.currentLanguage')}</Text>
            </View>
          </View>
        </View>

        {awarenessSections.map((section) => (
          <AwarenessCard
            key={section.title}
            title={section.title}
            body={section.body}
            points={section.points}
            rowDirection={rowDirection}
            textAlign={textAlign}
          />
        ))}

        <Pressable onPress={() => navigation.navigate('Login')} style={styles.button}>
          <Text style={styles.buttonLabel}>{t('common.getStarted')}</Text>
        </Pressable>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: theme.spacing.xl,
  },
  hero: {
    backgroundColor: theme.colors.primaryStrong,
    borderRadius: theme.radius.xl,
    marginBottom: theme.spacing.lg,
    overflow: 'hidden',
    padding: theme.spacing.lg,
    position: 'relative',
  },
  heroGlowLarge: {
    backgroundColor: theme.colors.accent,
    borderRadius: 999,
    height: 180,
    opacity: 0.15,
    position: 'absolute',
    right: -30,
    top: -20,
    width: 180,
  },
  heroGlowSmall: {
    backgroundColor: theme.colors.primarySoft,
    borderRadius: 999,
    height: 110,
    left: -20,
    opacity: 0.12,
    position: 'absolute',
    top: 90,
    width: 110,
  },
  eyebrow: {
    color: theme.colors.primarySoft,
    fontSize: theme.typography.caption,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
  },
  title: {
    color: theme.colors.textOnPrimary,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 38,
    marginBottom: theme.spacing.sm,
  },
  description: {
    color: theme.colors.textOnPrimary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  heroBadgeRow: {
    marginTop: theme.spacing.md,
  },
  heroBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  heroBadgeText: {
    color: theme.colors.textOnPrimary,
    fontSize: theme.typography.caption,
    fontWeight: '600',
  },
  card: {
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
  cardTitle: {
    color: theme.colors.primaryStrong,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
  },
  cardBody: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  pointList: {
    marginTop: theme.spacing.md,
    rowGap: theme.spacing.sm,
  },
  pointRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  pointDot: {
    backgroundColor: theme.colors.primary,
    borderRadius: 999,
    height: 10,
    marginTop: 7,
    width: 10,
  },
  pointText: {
    color: theme.colors.text,
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    justifyContent: 'center',
    marginTop: theme.spacing.sm,
    minHeight: 56,
    paddingHorizontal: theme.spacing.lg,
  },
  buttonLabel: {
    color: theme.colors.textOnPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
});
