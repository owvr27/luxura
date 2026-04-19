import { StyleSheet, Text, TextInput, View } from 'react-native';
import { theme } from '../theme';

export default function AuthTextField({
  autoCapitalize = 'none',
  autoCorrect = false,
  editable = true,
  error,
  maxLength,
  keyboardType = 'default',
  label,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  textAlign = 'left',
  value,
}) {
  return (
    <View style={styles.wrapper}>
      <Text style={[styles.label, { textAlign }]}>{label}</Text>
      <TextInput
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        editable={editable}
        keyboardType={keyboardType}
        maxLength={maxLength}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textSecondary}
        secureTextEntry={secureTextEntry}
        style={[
          styles.input,
          { textAlign },
          error ? styles.inputError : null,
        ]}
        value={value}
      />
      {error ? <Text style={[styles.errorText, { textAlign }]}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: theme.spacing.md,
  },
  label: {
    color: theme.colors.primaryStrong,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    color: theme.colors.text,
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  inputError: {
    borderColor: theme.colors.danger,
  },
  errorText: {
    color: theme.colors.danger,
    fontSize: 13,
    lineHeight: 18,
    marginTop: theme.spacing.xs,
  },
});
