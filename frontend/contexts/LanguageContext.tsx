'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.bins': 'Smart Bins',
    'nav.rewards': 'Rewards',
    'nav.wallet': 'My Wallet',
    'nav.redeem': 'Redeem',
    'nav.scan': 'Scan QR',
    'nav.images': 'Images',
    'nav.admin': 'Admin',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    
    // Home Page
    'home.title': 'Luxora',
    'home.subtitle': 'Environmental',
    'home.tagline': 'Transform Waste into Value',
    'home.description': 'Join the elite environmental movement where smart recycling meets premium rewards. Every contribution creates a sustainable future while earning exclusive benefits.',
    'home.getStarted': 'Begin Your Journey',
    'home.discoverBins': 'Discover Smart Bins',
    'home.members': 'Elite Members',
    'home.recycled': 'Kilograms Recycled',
    'home.rewardsClaimed': 'Rewards Claimed',
    'home.smartBins': 'Smart Bins',
    'home.whyLuxora': 'Why Choose Luxora?',
    'home.whyDescription': 'Experience the perfect blend of environmental responsibility and premium lifestyle benefits',
    'home.effortlessImpact': 'Effortless Impact',
    'home.effortlessDescription': 'Smart technology makes recycling seamless. Deposit, earn, and redeem with our intuitive ecosystem designed for modern lifestyles.',
    'home.premiumRewards': 'Premium Rewards',
    'home.premiumDescription': 'Access exclusive benefits from luxury brands, experiences, and services that celebrate your environmental commitment.',
    'home.globalImpact': 'Global Impact',
    'home.globalDescription': 'Join a worldwide community driving meaningful environmental change through innovative waste management solutions.',
    'home.howItWorks': 'How It Works',
    'home.howDescription': 'Three simple steps to transform your environmental impact into exclusive rewards',
    'home.depositSmart': 'Deposit Smart',
    'home.depositDescription': 'Use our intelligent bins to deposit recyclables. Each smart bin automatically tracks your contribution.',
    'home.earnPoints': 'Earn Points',
    'home.earnDescription': 'Receive instant points based on weight and material type. Watch your environmental impact grow in real-time.',
    'home.claimRewards': 'Claim Rewards',
    'home.claimDescription': 'Redeem points for premium rewards, exclusive experiences, and luxury partner offerings.',
    'home.readyTitle': 'Ready to Make a Difference?',
    'home.readyDescription': 'Join thousands of environmentally conscious individuals who are already earning premium rewards while creating a sustainable future.',
    'home.startJourney': 'Start Your Green Journey Today',
    
    // Auth
    'auth.login': 'Login',
    'auth.register': 'Register',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.name': 'Name',
    'auth.phone': 'Phone',
    'auth.location': 'Location',
    'auth.alreadyHaveAccount': 'Already have an account?',
    'auth.dontHaveAccount': "Don't have an account?",
    'auth.loginSuccess': 'Login successful',
    'auth.registerSuccess': 'Registration successful',
    'auth.invalidCredentials': 'Invalid credentials',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.close': 'Close',
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.sort': 'Sort',
    
    // Chat
    'chat.title': 'Luxora AI Assistant',
    'chat.subtitle': 'Always here to help',
    'chat.placeholder': 'Type your message...',
    'chat.welcome': 'Hello! I\'m Luxora AI',
    'chat.welcomeDescription': 'Ask me anything about recycling, rewards, or environmental tips!',
    'chat.error': 'Sorry, I\'m having trouble connecting. Please try again later.',
    'chat.suggestions': 'Suggested questions:',
    'chat.suggestion1': 'How do I start recycling?',
    'chat.suggestion2': 'What rewards can I earn?',
    'chat.suggestion3': 'Where are the bins?',
    'chat.tooltip': 'Chat with Luxora AI',
    
    // Footer
    'footer.title': 'Luxora Environmental',
    'footer.description': 'Premium smart waste management platform building a sustainable future through innovative recycling solutions.',
    'footer.quickLinks': 'Quick Links',
    'footer.contact': 'Contact',
    'footer.copyright': 'All rights reserved.',
    'footer.tagline': 'Building a cleaner future together',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.bins': 'الحاويات الذكية',
    'nav.rewards': 'المكافآت',
    'nav.wallet': 'محفظتي',
    'nav.redeem': 'استرداد',
    'nav.images': 'الصور',
    'nav.admin': 'لوحة الإدارة',
    'nav.login': 'تسجيل الدخول',
    'nav.register': 'إنشاء حساب',
    'nav.logout': 'تسجيل الخروج',
    
    // Home Page
    'home.title': 'لوكسورا',
    'home.subtitle': 'البيئية',
    'home.tagline': 'تحويل النفايات إلى قيمة',
    'home.description': 'انضم إلى نخبة العمل البيئي حيث تلتقي إعادة التدوير الذكية مع المكافآت القيمة. مساهمتك تبني مستقبلاً مستداماً وتمنحك مزايا حصرية.',
    'home.getStarted': 'ابدأ رحلتك الآن',
    'home.discoverBins': 'اكتشف الحاويات الذكية',
    'home.members': 'عضو مميز',
    'home.recycled': 'كيلوجرام أعيد تدويره',
    'home.rewardsClaimed': 'مكافأة ممنوحة',
    'home.smartBins': 'حاوية ذكية',
    'home.whyLuxora': 'لماذا تختار لوكسورا؟',
    'home.whyDescription': 'تجربة تجمع بشكل مثالي بين المسؤولية البيئية وأسلوب الحياة الراقي',
    'home.effortlessImpact': 'تأثير بلا عناء',
    'home.effortlessDescription': 'التكنولوجيا الذكية تجعل إعادة التدوير سلسة. أودع نفاياتك، التقط النقاط، واستردها من خلال نظامنا البيئي المصمم لأسلوب الحياة العصري.',
    'home.premiumRewards': 'مكافآت قيّمة',
    'home.premiumDescription': 'احصل على مزايا حصرية، تجارب، وخدمات من علامات تجارية راقية تحتفي بالتزامك البيئي.',
    'home.globalImpact': 'تأثير عالمي',
    'home.globalDescription': 'انضم إلى مجتمع عالمي يقود تغييراً بيئياً حقيقياً من خلال حلول مبتكرة لإدارة النفايات.',
    'home.howItWorks': 'كيف يعمل النظام؟',
    'home.howDescription': 'ثلاث خطوات بسيطة لتحويل تأثيرك البيئي إلى مكافآت حصرية',
    'home.depositSmart': 'الإيداع الذكي',
    'home.depositDescription': 'استخدم حاوياتنا الذكية لإيداع المواد القابلة لإعادة التدوير. كل حاوية تتتبع مساهمتك تلقائياً.',
    'home.earnPoints': 'اكتساب النقاط',
    'home.earnDescription': 'احصل على نقاط فورية بناءً على الوزن ونوع المادة. راقب نمو تأثيرك البيئي في الوقت الحقيقي.',
    'home.claimRewards': 'استرداد المكافآت',
    'home.claimDescription': 'استبدل نقاطك بمكافآت، تجارب حصرية، وعروض من شركائنا المتميزين.',
    'home.readyTitle': 'هل أنت مستعد لإحداث فرق؟',
    'home.readyDescription': 'انضم إلى الآلاف من المهتمين بالبيئة الذين يكسبون مكافآت قيّمة ويصنعون مستقبلاً مستداماً.',
    'home.startJourney': 'ابدأ رحلتك الخضراء اليوم',
    
    // Auth
    'auth.login': 'تسجيل الدخول',
    'auth.register': 'إنشاء حساب',
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.name': 'الاسم',
    'auth.phone': 'رقم الهاتف',
    'auth.location': 'الموقع',
    'auth.alreadyHaveAccount': 'لديك حساب بالفعل؟',
    'auth.dontHaveAccount': 'ليس لديك حساب؟',
    'auth.loginSuccess': 'تم تسجيل الدخول بنجاح',
    'auth.registerSuccess': 'تم إنشاء الحساب بنجاح',
    'auth.invalidCredentials': 'بيانات الاعتماد غير صالحة',
    
    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجاح',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.submit': 'إرسال',
    'common.close': 'إغلاق',
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.sort': 'ترتيب',
    
    // Chat
    'chat.title': 'المساعد الذكي لوكسورا',
    'chat.subtitle': 'متواجد دائماً للمساعدة',
    'chat.placeholder': 'اكتب رسالتك...',
    'chat.welcome': 'مرحباً! أنا المساعد لوكسورا',
    'chat.welcomeDescription': 'اسألني أي شيء عن إعادة التدوير، المكافآت، أو للحصول على نصائح بيئية!',
    'chat.error': 'عذراً، أواجه صعوبة في الاتصال. يرجى المحاولة مرة أخرى لاحقاً.',
    'chat.suggestions': 'الأسئلة المقترحة:',
    'chat.suggestion1': 'كيف أبدأ بإعادة التدوير؟',
    'chat.suggestion2': 'ما هي المكافآت المتاحة؟',
    'chat.suggestion3': 'أين أجد الحاويات الذكية؟',
    'chat.tooltip': 'تحدث مع المساعد الذكي',
    
    // Footer
    'footer.title': 'لوكسورا البيئية',
    'footer.description': 'منصة حديثة لإدارة النفايات تهدف لبناء مستقبل مستدام من خلال حلول التدوير المبتكرة.',
    'footer.quickLinks': 'روابط سريعة',
    'footer.contact': 'تواصل معنا',
    'footer.copyright': 'جميع الحقوق محفوظة.',
    'footer.tagline': 'نبني مستقبلاً أنظف معاً',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const storedLanguage = localStorage.getItem('language') as Language;
    if (storedLanguage && ['en', 'ar'].includes(storedLanguage)) {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  const isRTL = language === 'ar';

  const value: LanguageContextType = {
    language,
    setLanguage,
    t,
    isRTL,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
