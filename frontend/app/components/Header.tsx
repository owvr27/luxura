'use client';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import MobileMenu from './MobileMenu';

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const { language, setLanguage, t, isRTL } = useLanguage();

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <a 
              href="/" 
              className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-forest-green to-earth-brown rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-luxury">
                L
              </div>
              <span className="text-xl font-bold text-gradient-luxury font-playfair">
                Luxora Environmental
              </span>
            </a>
          </div>
          <div className="hidden md:flex items-center gap-1">
            <a 
              href="/" 
              className="px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 font-medium text-sm"
            >
              {t('nav.home')}
            </a>
            {isAuthenticated && (
              <>
                <a 
                  href="/bins" 
                  className="px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 font-medium text-sm"
                >
                  {t('nav.bins')}
                </a>
                <a 
                  href="/scan" 
                  className="px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 font-medium text-sm"
                >
                  {t('nav.scan')}
                </a>
                <a 
                  href="/rewards" 
                  className="px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 font-medium text-sm"
                >
                  {t('nav.rewards')}
                </a>
                <a 
                  href="/redeem" 
                  className="px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 font-medium text-sm"
                >
                  {t('nav.redeem')}
                </a>
                <a 
                  href="/wallet" 
                  className="px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 font-medium text-sm"
                >
                  {t('nav.wallet')}
                </a>
                <a 
                  href="/images" 
                  className="px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 font-medium text-sm"
                >
                  {t('nav.images')}
                </a>
                {user?.role === 'admin' && (
                  <a 
                    href="/admin/dashboard" 
                    className="px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 font-medium text-sm"
                  >
                    {t('nav.admin')}
                  </a>
                )}
              </>
            )}
          </div>
          <div className="hidden md:flex items-center gap-2">
            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 font-medium text-sm flex items-center gap-2"
              title={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
            >
              {language === 'en' ? 'AR' : 'EN'}
              <span className="text-lg">{language === 'en' ? 'Arabic' : 'English'}</span>
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="px-3 py-2 text-gray-700 font-medium text-sm">
                  {language === 'en' ? 'Welcome' : 'مرحباً'}, {user?.name}
                </span>
                <button 
                  onClick={logout}
                  className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors duration-200 font-medium text-sm"
                >
                  {t('auth.logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <a 
                  href="/login" 
                  className="px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200 font-medium text-sm"
                >
                  {t('auth.login')}
                </a>
                <a 
                  href="/register" 
                  className="px-3 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg text-sm"
                >
                  {t('auth.register')}
                </a>
              </div>
            )}
          </div>
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </nav>
      </div>
    </header>
  );
}
