import { StyleSheet, Text, View } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { useLanguage } from '../context/LanguageContext';
import { theme } from '../theme';

export default function PlaceholderScreen({ title, description }) {
  const { isRTL, rowDirection, t, textAlign } = useLanguage();

  return (
    <ScreenContainer>
      <View style={styles.card}>
        <View style={[styles.badgeRow, { flexDirection: rowDirection }]}>
          <View style={styles.badge}>
            <Text style={[styles.badgeText, { textAlign }]}>{t('common.currentLanguage')}</Text>
          </View>
        </View>
        <Text style={[styles.title, { textAlign }]}>{title}</Text>
        <Text style={[styles.description, { textAlign }]}>{description}</Text>
        <View style={[styles.footerNote, isRTL && styles.footerNoteRtl]}>
          <Text style={[styles.footerText, { textAlign }]}>{t('common.comingSoon')}</Text>
        </View>
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
    padding: theme.spacing.lg,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  badgeRow: {
    marginBottom: theme.spacing.md,
  },
  badge: {
    backgroundColor: theme.colors.primarySurface,
    borderRadius: 999,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  badgeText: {
    color: theme.colors.primaryStrong,
    fontSize: theme.typography.caption,
    fontWeight: '600',
  },
  title: {
    color: theme.colors.primaryStrong,
    fontSize: theme.typography.title,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
  },
  description: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  footerNote: {
    backgroundColor: theme.colors.surfaceMuted,
    borderRadius: theme.radius.md,
    marginTop: theme.spacing.lg,
    padding: theme.spacing.md,
  },
  footerNoteRtl: {
    alignItems: 'flex-end',
  },
  footerText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.caption,
    lineHeight: 18,
  },
});
