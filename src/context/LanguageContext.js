import { createContext, useContext, useMemo, useState } from 'react';
import { defaultLanguage, translate } from '../i18n';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(defaultLanguage);

  const value = useMemo(() => {
    const isRTL = language === 'ar';

    return {
      language,
      isRTL,
      setLanguage,
      toggleLanguage: () => {
        setLanguage((currentLanguage) => (currentLanguage === 'en' ? 'ar' : 'en'));
      },
      t: (key) => translate(language, key),
      textAlign: isRTL ? 'right' : 'left',
      rowDirection: isRTL ? 'row-reverse' : 'row',
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
}
