'use client';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="md:hidden">
      <button
        onClick={toggleMenu}
        className="p-2 rounded-lg text-gray-700 hover:bg-green-50 transition-colors"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-16 right-4 left-4 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4 space-y-2">
            <a
              href="/"
              className="block px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium"
            >
              الرئيسية
            </a>
            {isAuthenticated && (
              <>
                <a
                  href="/bins"
                  className="block px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium"
                >
                  الحاويات
                </a>
                <a
                  href="/rewards"
                  className="block px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium"
                >
                  المكافآت
                </a>
                <a
                  href="/redeem"
                  className="block px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium"
                >
                  استرداد
                </a>
                <a
                  href="/wallet"
                  className="block px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium"
                >
                  المحفظة
                </a>
                <a
                  href="/images"
                  className="block px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium"
                >
                  الصور
                </a>
                {user?.role === 'admin' && (
                  <a
                    href="/admin/dashboard"
                    className="block px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium"
                  >
                    الإدارة
                  </a>
                )}
              </>
            )}
            
            <div className="border-t border-gray-200 pt-2 mt-2">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-gray-700 font-medium">
                    مرحباً، {user?.name}
                  </div>
                  <button
                    onClick={logout}
                    className="block w-full text-right px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors font-medium"
                  >
                    تسجيل الخروج
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/login"
                    className="block px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors font-medium"
                  >
                    تسجيل الدخول
                  </a>
                  <a
                    href="/register"
                    className="block px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                  >
                    تسجيل
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
