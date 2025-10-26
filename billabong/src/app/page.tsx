'use client';

import { useState } from 'react';
import Image from 'next/image';
import { KayakAnimation } from './components/KayakAnimation';

// Configuration URLs (can be moved to environment variables)
const CONFIG = {
  apply_url: '/apply',
  events_url: 'https://luma.com/arrayah?k=c',
  residency_url: '/residency',
  arrayah_home_url: 'https://arrayah.city',
  contact_url: 'mailto:hello@billabong.house',
};

// FAQ data
const FAQ_ITEMS = [
  {
    question: 'Who is it for?',
    answer: 'Billabong is for builders, researchers, and creators with high agency, intensity, ambition, and kindness. If you&apos;re working on something that matters and want to do it alongside others, this is for you.',
  },
  {
    question: 'How long is the residency?',
    answer: 'We offer flexible residency durations from 1 month to 6 months, with potential for extension. The sweet spot is 3 months — enough time to make real progress.',
  },
  {
    question: 'What are costs & inclusions?',
    answer: 'Residency includes a dedicated desk, private or shared bedroom, fiber internet, kitchen access, community dinners, and demo nights. Pricing varies by room type and duration. Contact us for details.',
  },
  {
    question: 'What\'s a normal week like?',
    answer: 'Most residents work deeply during focus hours (9am–5pm), participate in 1-2 community dinners per week, and join optional Friday demos. Weekends are for rest, exploration, or continued building.',
  },
  {
    question: 'Can I attend events without staying?',
    answer: 'Yes! We regularly host open salons, demos, and waterfront walks. Check our events calendar and sign up. Some events are resident-only, but most welcome the broader community.',
  },
];

export default function Home() {
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [wifiDialogOpen, setWifiDialogOpen] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailStatus('error');
      return;
    }
    // Simulate submission
    setEmailStatus('success');
    setEmail('');
    setTimeout(() => setEmailStatus('idle'), 3000);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="water-dots min-h-screen">
      {/* Wifi Dialog */}
      {wifiDialogOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setWifiDialogOpen(false)}
        >
          <div 
            className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-heading font-semibold text-2xl text-[#0D1B2A] mb-4">
              WiFi Access
            </h3>
            <p className="font-body text-[#1A1A1A]/80 leading-relaxed mb-6">
              We have public wifi throughout the house. Connect to <strong className="text-[#1F7A8C]">billabong_homies</strong>, there is no password.
            </p>
            <button
              onClick={() => setWifiDialogOpen(false)}
              className="w-full px-6 py-3 bg-[#1F7A8C] text-white rounded-full font-medium hover:bg-[#0D1B2A] transition-all"
            >
              Got it
            </button>
          </div>
        </div>
      )}
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#F7F8F5]/90 backdrop-blur-sm border-b border-[#1F7A8C]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a href="#hero" className="font-heading font-bold text-xl text-[#0D1B2A]">
              billabong
            </a>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="/house-rules" className="ripple-underline text-sm font-medium text-[#1A1A1A] hover:text-[#1F7A8C] transition-colors">
                house rules
              </a>
              <a href="/residents" className="ripple-underline text-sm font-medium text-[#1A1A1A] hover:text-[#1F7A8C] transition-colors">
                residents
              </a>

              <a 
                href={CONFIG.apply_url} 
                className="px-6 py-2 bg-[#1F7A8C] text-white rounded-full font-medium text-sm hover:bg-[#0D1B2A] transition-all hover:shadow-lg"
              >
                apply now
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-[#1F7A8C]/10"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#1F7A8C]/10 bg-[#F7F8F5]">
            <div className="px-4 py-4 space-y-3">
              <a href="#about" className="block text-sm font-medium text-[#1A1A1A] hover:text-[#1F7A8C]">
                About
              </a>
              <a href="#residency" className="block text-sm font-medium text-[#1A1A1A] hover:text-[#1F7A8C]">
                Residency
              </a>
              <a href="#residents" className="block text-sm font-medium text-[#1A1A1A] hover:text-[#1F7A8C]">
                Residents
              </a>
              <a href="#location" className="block text-sm font-medium text-[#1A1A1A] hover:text-[#1F7A8C]">
                Location
              </a>
              <a 
                href={CONFIG.apply_url} 
                className="block w-full px-6 py-2 bg-[#1F7A8C] text-white rounded-full font-medium text-sm text-center hover:bg-[#0D1B2A]"
              >
                Apply Now
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Kayak Animation - in hero background */}
        <KayakAnimation />
        
        <div className="absolute inset-0 bg-gradient-to-br from-[#1F7A8C]/5 via-transparent to-[#6C8C64]/5" />
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="mb-8">
            <Image 
              src="/arrayh_logo.jpg" 
              alt="Billabong House" 
              width={120} 
              height={120}
              className="mx-auto rounded-2xl shadow-xl"
            />
          </div>
          <h1 className="font-heading font-bold text-5xl sm:text-6xl lg:text-7xl text-[#0D1B2A] mb-6 leading-tight">
            where momentum gathers.
          </h1>
          <p className="font-body text-lg sm:text-xl text-[#1A1A1A]/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            a waterfront residency home in Sydney for builders, researchers, and creators. 
          </p>
          <p className="font-heading text-2xl sm:text-3xl text-[#1F7A8C] mb-12 font-semibold">
            you can just do things.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            
            <button 
              onClick={() => setWifiDialogOpen(true)}
              className="px-8 py-4 bg-[#1F7A8C] text-white rounded-full font-heading font-semibold text-lg hover:bg-[#0D1B2A] transition-all hover:shadow-2xl hover:scale-105"
            >
              connect &rarr; <span className="text-xl">☁️</span>
            </button>

            <a 
              href={CONFIG.events_url}
              className="px-8 py-4 border-2 border-[#1F7A8C] text-[#1F7A8C] rounded-full font-heading font-semibold text-lg hover:bg-[#1F7A8C] hover:text-white transition-all"
            >
              Upcoming Events
            </a>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <a href="#manifesto" aria-label="Scroll to manifesto section">
            <svg className="w-6 h-6 text-[#1F7A8C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </a>
        </div>
      </section>
      
       {/* Why We Exist */}
       <section id="manifesto" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[#0D1B2A] to-[#1F7A8C] rounded-2xl p-12 sm:p-16 text-white shadow-2xl">
            <h2 className="font-heading font-bold text-3xl sm:text-4xl mb-6">
              why we exist
            </h2>
            <blockquote className="font-body text-lg sm:text-xl leading-relaxed mb-6 opacity-90">
              &quot;the world&apos;s hardest problems aren&apos;t solved for lack of people but for lack of places to truly experiment. breaking free to build is liberating - and lonely. we create spaces where you don&apos;t do it alone.&quot;
            </blockquote>
            <a 
              href={CONFIG.arrayah_home_url}
              className="inline-block ripple-underline text-[#E9DCC2] font-medium hover:text-white transition-colors"
            >
              Learn about Arrayah →
            </a>
          </div>
        </div>
      </section>

      {/* About Billabong */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading font-bold text-4xl sm:text-5xl text-[#0D1B2A] mb-8 text-center">
            about billabong
          </h2>
          <p className="font-body text-lg text-[#1A1A1A]/80 mb-16 max-w-3xl mx-auto text-center leading-relaxed">
            big problems need brave spaces to experiment. billabong is our brave experiment, a meeting place for builders, researchers and creators
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: 'high agency', description: 'own your time, own your outcomes.', icon: '⚡' },
              { title: 'wholistic building', description: 'work hard, live well', icon: '❤️' },
              { title: 'ambition, locally rooted', description: 'build for a better future  🇦🇺', icon: '🌊' },
            ].map((value, idx) => (
              <div 
                key={idx}
                className="bg-[#F7F8F5] rounded-xl p-8 hover:shadow-xl transition-all hover:-translate-y-1 border border-[#1F7A8C]/10"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="font-heading font-semibold text-xl text-[#0D1B2A] mb-3">
                  {value.title}
                </h3>
                <p className="font-body text-[#1A1A1A]/70">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Upcoming Events */}
      <section id="events" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1F7A8C]/5 to-[#6C8C64]/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading font-bold text-4xl sm:text-5xl text-[#0D1B2A] mb-6">
            upcoming events
          </h2>
          <p className="font-body text-lg text-[#1A1A1A]/80 mb-8">
            co-working, fireside chats, and more.
          </p>
          <a 
            href={CONFIG.events_url}
            className="inline-block px-8 py-4 bg-[#1F7A8C] text-white rounded-full font-heading font-semibold text-lg hover:bg-[#0D1B2A] transition-all hover:shadow-xl"
          >
            See Calendar
          </a>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-[#0D1B2A] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-heading font-bold text-xl mb-4">billabong</h3>
              <p className="font-body text-white/70 text-sm mb-4">
                a waterfront meeting place for builders, researchers and creators
              </p>
              <p className="font-body text-white/70 text-sm">
                Drummoyne, NSW<br />
                <a href={CONFIG.contact_url} className="ripple-underline hover:text-white">
                  hello@billabong.house
                </a>
              </p>
            </div>
            
            <div>
              
            </div>
            
            <div>
              <h4 className="font-heading font-semibold mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all" aria-label="Twitter">
                  <span className="text-xl">𝕏</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all" aria-label="Instagram">
                  <span className="text-xl">📷</span>
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all" aria-label="LinkedIn">
                  <span className="text-xl">💼</span>
                </a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8">
            <p className="font-body text-white/50 text-xs text-center mb-2">
              We acknowledge the Gadigal and Wangal people of the Eora Nation, the traditional custodians of the land on which we gather, and pay our respects to Elders past and present.
            </p>
            <p className="font-body text-white/50 text-xs text-center">
              © {new Date().getFullYear()} Billabong House. Part of Arrayah.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
