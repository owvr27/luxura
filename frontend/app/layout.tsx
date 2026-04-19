import '../styles/globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import { LanguageProvider } from '../contexts/LanguageContext';
import Header from './components/Header';
import Chatbot from '../components/Chatbot';

export const metadata = { title: 'Luxora Environmental', description: 'Luxora Environmental - نظام ذكي لإدارة النفايات وإعادة التدوير. اكسب النقاط من خلال إعادة التدوير واستبدلها بمكافآت قيمة.' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-luxury-soft text-dark-charcoal antialiased">
        <LanguageProvider>
          <AuthProvider>
            <Header />
            <main className="min-h-screen">{children}</main>
            <footer className="bg-luxury-primary text-white py-16 mt-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-luxury-accent">Luxora Environmental</h3>
                    <p className="text-white/80 text-sm leading-relaxed">
                      Premium smart waste management platform building a sustainable future through innovative recycling solutions.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-luxury-accent">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                      <li><a href="/bins" className="text-white/80 hover:text-luxury-accent transition-colors">Smart Bins</a></li>
                      <li><a href="/rewards" className="text-white/80 hover:text-luxury-accent transition-colors">Premium Rewards</a></li>
                      <li><a href="/wallet" className="text-white/80 hover:text-luxury-accent transition-colors">My Wallet</a></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-luxury-accent">Contact</h3>
                    <p className="text-white/80 text-sm leading-relaxed">
                      <a href="mailto:info@luxora-environmental.com" className="hover:text-luxury-accent transition-colors">
                        info@luxora-environmental.com
                      </a>
                      <br />
                      <a href="tel:+201070225375" className="hover:text-luxury-accent transition-colors">
                        +20 107 022 5375
                      </a>
                    </p>
                  </div>
                </div>
                <div className="border-t border-white/20 mt-8 pt-8 text-center">
                  <p className="text-white/80 text-sm">
                    {new Date().getFullYear()} Luxora Environmental. All rights reserved.
                  </p>
                  <p className="text-white/60 mt-2 text-xs">
                    Building a cleaner future together
                  </p>
                </div>
              </div>
            </footer>
            <Chatbot />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}