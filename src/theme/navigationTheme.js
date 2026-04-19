import { DefaultTheme } from '@react-navigation/native';
import { theme } from './index';

export const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.colors.background,
    card: theme.colors.surface,
    border: theme.colors.border,
    primary: theme.colors.primary,
    text: theme.colors.text,
    notification: theme.colors.primaryStrong,
  },
};
