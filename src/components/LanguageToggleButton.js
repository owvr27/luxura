import { Pressable, StyleSheet, Text } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { theme } from '../theme';

export default function LanguageToggleButton() {
  const { t, toggleLanguage } = useLanguage();

  return (
    <Pressable onPress={toggleLanguage} style={styles.button}>
      <Text style={styles.label}>{t('common.languageToggle')}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: theme.colors.primarySoft,
    borderColor: theme.colors.borderStrong,
    borderRadius: 999,
    borderWidth: 1,
    justifyContent: 'center',
    minWidth: 44,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  label: {
    color: theme.colors.primaryStrong,
    fontSize: theme.typography.caption,
    fontWeight: '700',
  },
});
