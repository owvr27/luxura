import { ar } from './translations/ar';
import { en } from './translations/en';

export const translations = {
  en,
  ar,
};

export const defaultLanguage = 'en';

function getNestedValue(source, key) {
  return key.split('.').reduce((value, part) => value?.[part], source);
}

export function translate(language, key) {
  const activeTranslations = translations[language] ?? translations[defaultLanguage];
  return (
    getNestedValue(activeTranslations, key) ??
    getNestedValue(translations[defaultLanguage], key) ??
    key
  );
}
