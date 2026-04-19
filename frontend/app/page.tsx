'use client';
import { useLanguage } from '../contexts/LanguageContext';

export default function Home() {
  const { t, language, isRTL } = useLanguage();
  return (
    <div className="min-h-screen bg-luxury-soft">
      {/* Hero Section - Cinematic Luxury */}
      <section className="relative bg-luxury-hero text-white py-32 md:py-48 px-4 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-[32rem] h-[32rem] bg-elegant-gold rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-forest-green/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block mb-8 px-6 py-3 glass-luxury rounded-full border border-white/20 animate-fade-in-up">
            <span className="text-sm font-semibold text-luxury-accent">{t('home.platform')}</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold mb-8 animate-fade-in-up animate-stagger-1 leading-tight">
            <span className="text-gradient-accent">{t('home.title')}</span>
            <br />
            <span className="text-4xl md:text-5xl font-light text-white/90">{t('home.subtitle')}</span>
          </h1>
          
          <p className="text-2xl md:text-4xl mb-6 text-white/95 font-light animate-fade-in-up animate-stagger-2">
            {t('home.tagline')}
          </p>
          
          <p className="text-xl md:text-2xl max-w-4xl mx-auto text-white/80 mb-12 leading-relaxed animate-fade-in-up animate-stagger-3">
            {t('home.description')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up animate-stagger-4">
            <a
              href="/register"
              className="btn-luxury-primary text-lg px-12 py-4 hover-scale"
            >
              {t('home.getStarted')}
            </a>
            <a
              href="/bins"
              className="btn-luxury-secondary text-lg px-12 py-4 border-white/30 text-white hover:bg-white hover:text-forest-green"
            >
              {t('home.discoverBins')}
            </a>
          </div>
        </div>
        
        {/* Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-luxury-soft to-transparent"></div>
      </section>

      {/* Statistics Section - Premium Cards */}
      <section className="py-20 px-4 bg-luxury-soft -mt-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="card-luxury text-center hover-lift animate-fade-in-up animate-stagger-1">
              <div className="text-5xl font-bold text-gradient-luxury mb-3">50K+</div>
              <div className="text-luxury-secondary font-medium">Elite Members</div>
            </div>
            <div className="card-luxury text-center hover-lift animate-fade-in-up animate-stagger-2">
              <div className="text-5xl font-bold text-gradient-luxury mb-3">200K+</div>
              <div className="text-luxury-secondary font-medium">Kilograms Recycled</div>
            </div>
            <div className="card-luxury text-center hover-lift animate-fade-in-up animate-stagger-3">
              <div className="text-5xl font-bold text-gradient-luxury mb-3">15K+</div>
              <div className="text-luxury-secondary font-medium">Rewards Claimed</div>
            </div>
            <div className="card-luxury text-center hover-lift animate-fade-in-up animate-stagger-4">
              <div className="text-5xl font-bold text-gradient-luxury mb-3">500+</div>
              <div className="text-luxury-secondary font-medium">Smart Bins</div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Luxora Section - Luxury Features */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gradient-luxury mb-6">
              Why Choose Luxora?
            </h2>
            <p className="text-xl text-luxury-secondary max-w-3xl mx-auto leading-relaxed">
              Experience the perfect blend of environmental responsibility and premium lifestyle benefits
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="card-luxury hover-lift animate-fade-in-up animate-stagger-1">
              <div className="text-6xl mb-6 text-luxury-accent">⚡</div>
              <h3 className="text-3xl font-bold text-luxury-primary mb-4">Effortless Impact</h3>
              <p className="text-luxury-secondary leading-relaxed text-lg">
                Smart technology makes recycling seamless. Deposit, earn, and redeem with our intuitive ecosystem designed for modern lifestyles.
              </p>
            </div>
            
            <div className="card-luxury hover-lift animate-fade-in-up animate-stagger-2">
              <div className="text-6xl mb-6 text-luxury-accent">💎</div>
              <h3 className="text-3xl font-bold text-luxury-primary mb-4">Premium Rewards</h3>
              <p className="text-luxury-secondary leading-relaxed text-lg">
                Access exclusive benefits from luxury brands, experiences, and services that celebrate your environmental commitment.
              </p>
            </div>
            
            <div className="card-luxury hover-lift animate-fade-in-up animate-stagger-3">
              <div className="text-6xl mb-6 text-luxury-accent">🌍</div>
              <h3 className="text-3xl font-bold text-luxury-primary mb-4">Global Impact</h3>
              <p className="text-luxury-secondary leading-relaxed text-lg">
                Join a worldwide community driving meaningful environmental change through innovative waste management solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Luxury Process */}
      <section className="py-24 px-4 bg-luxury-soft">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-gradient-luxury mb-6">
              How It Works
            </h2>
            <p className="text-xl text-luxury-secondary max-w-3xl mx-auto leading-relaxed">
              Three simple steps to transform your environmental impact into exclusive rewards
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center animate-fade-in-up animate-stagger-1">
              <div className="w-24 h-24 bg-luxury-primary rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 hover-scale">
                1
              </div>
              <h3 className="text-2xl font-bold text-luxury-primary mb-4">Deposit Smart</h3>
              <p className="text-luxury-secondary leading-relaxed">
                Use our intelligent bins to deposit recyclables. Each smart bin automatically tracks your contribution.
              </p>
            </div>
            
            <div className="text-center animate-fade-in-up animate-stagger-2">
              <div className="w-24 h-24 bg-luxury-primary rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 hover-scale">
                2
              </div>
              <h3 className="text-2xl font-bold text-luxury-primary mb-4">Earn Points</h3>
              <p className="text-luxury-secondary leading-relaxed">
                Receive instant points based on weight and material type. Watch your environmental impact grow in real-time.
              </p>
            </div>
            
            <div className="text-center animate-fade-in-up animate-stagger-3">
              <div className="w-24 h-24 bg-luxury-primary rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 hover-scale">
                3
              </div>
              <h3 className="text-2xl font-bold text-luxury-primary mb-4">Claim Rewards</h3>
              <p className="text-luxury-secondary leading-relaxed">
                Redeem points for premium rewards, exclusive experiences, and luxury partner offerings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Premium */}
      <section className="py-24 px-4 bg-luxury-hero text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl mb-10 text-white/90 leading-relaxed">
            Join thousands of environmentally conscious individuals who are already earning premium rewards 
            while creating a sustainable future.
          </p>
          <a
            href="/register"
            className="btn-luxury-secondary text-lg px-12 py-4 border-white/30 text-white hover:bg-white hover:text-forest-green hover-scale"
          >
            Start Your Green Journey Today
          </a>
        </div>
      </section>
    </div>
  );
}
