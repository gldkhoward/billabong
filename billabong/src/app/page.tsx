'use client';

import { useState } from 'react';
import Image from 'next/image';
import { KayakAnimation } from './components/KayakAnimation';

// Configuration URLs (can be moved to environment variables)
const CONFIG = {
  apply_url: '/apply',
  events_url: '/events',
  residency_url: '/residency',
  arrayah_home_url: 'https://arrayah.city',
  contact_url: 'mailto:hello@billabong.house',
};

// Sample resident data
const RESIDENTS = [
  { name: 'Abeer', bio: 'ML for climate risk.', tags: ['ML', 'Climate'], avatar: '/arrayh_logo.jpg' },
  { name: 'Chelsea', bio: 'Bio-design for circular textiles.', tags: ['Biodesign', 'Materials'], avatar: '/arrayh_logo.jpg' },
  { name: 'Elliott', bio: 'Robotics for reef monitoring.', tags: ['Robotics', 'Ocean'], avatar: '/arrayh_logo.jpg' },
  { name: 'Luke', bio: 'Infra for open science.', tags: ['DevTools', 'Research'], avatar: '/arrayh_logo.jpg' },
  { name: 'Maya', bio: 'Short films on builders at work.', tags: ['Film', 'Story'], avatar: '/arrayh_logo.jpg' },
  { name: 'Todd', bio: 'Low-cost hardware for labs.', tags: ['Hardware', 'Education'], avatar: '/arrayh_logo.jpg' },
];

// House rules
const HOUSE_RULES = [
  { icon: '🤫', title: 'Respect Focus', description: 'Quiet hours 9am–5pm; calls in call nooks.' },
  { icon: '🚀', title: 'Default to Build', description: 'Progress over perfection; ship weekly.' },
  { icon: '🧹', title: 'Care for the Commons', description: 'Clean as you go; shared responsibility.' },
  { icon: '🏠', title: 'Host with Heart', description: 'Guests via sign-up; introduce visitors.' },
  { icon: '💪', title: 'Health First', description: 'Sleep, stretch, sun; don&apos;t burn out.' },
  { icon: '💬', title: 'Kind Candor', description: 'Feedback that helps people win.' },
];

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
              <a href="/info" className="ripple-underline text-sm font-medium text-[#1A1A1A] hover:text-[#1F7A8C] transition-colors">
                info
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
          <a href="#about" aria-label="Scroll to about section">
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

      {/* Residency Snapshot */}
      <section id="residency" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F7F8F5]">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading font-bold text-4xl sm:text-5xl text-[#0D1B2A] mb-8 text-center">
            Residency Snapshot
          </h2>
          <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-lg">
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <span className="text-[#1F7A8C] font-bold text-xl mr-3">•</span>
                <span className="font-body text-lg text-[#1A1A1A]/80">
                  <strong>Duration:</strong> Flexible 1–6 month residencies; 3 months recommended
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1F7A8C] font-bold text-xl mr-3">•</span>
                <span className="font-body text-lg text-[#1A1A1A]/80">
                  <strong>Who it&apos;s for:</strong> Builders, researchers, creators with high agency and ambition
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1F7A8C] font-bold text-xl mr-3">•</span>
                <span className="font-body text-lg text-[#1A1A1A]/80">
                  <strong>What you get:</strong> Dedicated desk, room options, fiber internet, community dinners, demo nights
                </span>
              </li>
              <li className="flex items-start">
                <span className="text-[#1F7A8C] font-bold text-xl mr-3">•</span>
                <span className="font-body text-lg text-[#1A1A1A]/80">
                  <strong>Expectations:</strong> Focus hours (9am–5pm), contribution to house chores, weekly shipping
                </span>
              </li>
            </ul>
            <a 
              href={CONFIG.residency_url}
              className="inline-block px-6 py-3 bg-[#1F7A8C] text-white rounded-full font-medium hover:bg-[#0D1B2A] transition-all"
            >
              Read Residency Details
            </a>
          </div>
        </div>
      </section>

      {/* House Rules */}
      <section id="rules" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading font-bold text-4xl sm:text-5xl text-[#0D1B2A] mb-6 text-center">
            House Rules
          </h2>
          <p className="font-body text-lg text-[#1A1A1A]/70 mb-12 text-center max-w-2xl mx-auto">
            Simple guidelines to help everyone focus and thrive together.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {HOUSE_RULES.slice(0, 3).map((rule, idx) => (
              <div 
                key={idx}
                className="bg-[#F7F8F5] rounded-xl p-6 hover:shadow-lg transition-all border border-[#1F7A8C]/10"
              >
                <div className="text-3xl mb-3">{rule.icon}</div>
                <h3 className="font-heading font-semibold text-lg text-[#0D1B2A] mb-2">
                  {rule.title}
                </h3>
                <p className="font-body text-sm text-[#1A1A1A]/70">
                  {rule.description}
                </p>
              </div>
            ))}
          </div>
          <div className="text-center">
            <a 
              href="/house-rules"
              className="inline-block px-8 py-3 bg-[#1F7A8C] text-white rounded-full font-medium hover:bg-[#0D1B2A] transition-all"
            >
              View All House Rules
            </a>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section id="events" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1F7A8C]/5 to-[#6C8C64]/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-heading font-bold text-4xl sm:text-5xl text-[#0D1B2A] mb-6">
            Upcoming Events
          </h2>
          <p className="font-body text-lg text-[#1A1A1A]/80 mb-8">
            Demos, open salons, and waterfront walks.
          </p>
          <a 
            href={CONFIG.events_url}
            className="inline-block px-8 py-4 bg-[#1F7A8C] text-white rounded-full font-heading font-semibold text-lg hover:bg-[#0D1B2A] transition-all hover:shadow-xl"
          >
            See Calendar
          </a>
        </div>
      </section>

      {/* Residents */}
      <section id="residents" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading font-bold text-4xl sm:text-5xl text-[#0D1B2A] mb-4 text-center">
            Who&apos;s Building at Billabong
          </h2>
          <p className="font-body text-lg text-[#1A1A1A]/70 mb-12 text-center">
            Meet some of our current residents
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {RESIDENTS.map((resident, idx) => (
              <div 
                key={idx}
                className="bg-[#F7F8F5] rounded-xl p-6 hover:shadow-xl transition-all hover:-translate-y-1 border border-[#1F7A8C]/10"
              >
                <div className="mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1F7A8C] to-[#6C8C64] flex items-center justify-center text-white font-heading font-bold text-xl overflow-hidden">
                    <Image 
                      src={resident.avatar} 
                      alt={resident.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="font-heading font-semibold text-xl text-[#0D1B2A] mb-2">
                  {resident.name}
                </h3>
                <p className="font-body text-[#1A1A1A]/70 mb-3">
                  {resident.bio}
                </p>
                <div className="flex flex-wrap gap-2">
                  {resident.tags.map((tag, tagIdx) => (
                    <span 
                      key={tagIdx}
                      className="px-3 py-1 bg-[#1F7A8C]/10 text-[#1F7A8C] rounded-full text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Space & Location */}
      <section id="location" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F7F8F5]">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading font-bold text-4xl sm:text-5xl text-[#0D1B2A] mb-12 text-center">
            Space & Location
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="font-heading font-semibold text-2xl text-[#0D1B2A] mb-4">
                Facilities
              </h3>
              <ul className="space-y-3">
                {[
                  'Dedicated desks with ergonomic chairs',
                  'Meeting nooks for calls and collaboration',
                  'Workshop table for hardware projects',
                  'Fiber internet (1Gbps)',
                  'Full kitchen and dining area',
                  'Laundry facilities',
                  'River balcony for breaks',
                  'Bike storage',
                ].map((facility, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-[#1F7A8C] mr-3">✓</span>
                    <span className="font-body text-[#1A1A1A]/80">{facility}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-heading font-semibold text-2xl text-[#0D1B2A] mb-4">
                Getting Here
              </h3>
              <p className="font-body text-[#1A1A1A]/80 mb-4">
                <strong>Location:</strong> Drummoyne, NSW — a peaceful riverside suburb just 7km from Sydney CBD.
              </p>
              <p className="font-body text-[#1A1A1A]/80 mb-4">
                <strong>Transport:</strong> Regular ferry service to Circular Quay (20 min), frequent buses, easy cycling distance to the city.
              </p>
              <p className="font-body text-[#1A1A1A]/80">
                <strong>Neighborhood:</strong> Bay runs along the harbor, excellent coffee spots, parks, and local makers community.
              </p>
              <div className="mt-6 bg-[#E9DCC2]/30 rounded-xl p-6 border border-[#6C8C64]/20">
                <p className="font-body text-sm text-[#1A1A1A]/70 italic">
                  📍 Exact address provided upon acceptance
                </p>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="bg-gradient-to-br from-[#1F7A8C]/10 to-[#6C8C64]/10 rounded-2xl h-96 flex items-center justify-center border border-[#1F7A8C]/20">
            <div className="text-center">
              <div className="text-6xl mb-4">📍</div>
              <p className="font-heading font-semibold text-xl text-[#0D1B2A]">
                Drummoyne, NSW
              </p>
              <p className="font-body text-[#1A1A1A]/70 mt-2">
                Interactive map coming soon
              </p>
            </div>
          </div>
        </div>
      </section>

     

      {/* Apply Section */}
      <section id="apply" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F7F8F5]">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-heading font-bold text-4xl sm:text-5xl text-[#0D1B2A] mb-6 text-center">
            Apply
          </h2>
          <p className="font-body text-lg text-[#1A1A1A]/80 mb-12 text-center max-w-2xl mx-auto">
            If you&apos;re a builder, researcher, or creator with high agency, intensity, ambition, and kindness—this is for you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a 
              href={CONFIG.apply_url}
              className="px-8 py-4 bg-[#1F7A8C] text-white rounded-full font-heading font-semibold text-lg hover:bg-[#0D1B2A] transition-all hover:shadow-xl text-center"
            >
              Apply Now
            </a>
            <a 
              href={CONFIG.contact_url}
              className="px-8 py-4 border-2 border-[#1F7A8C] text-[#1F7A8C] rounded-full font-heading font-semibold text-lg hover:bg-[#1F7A8C] hover:text-white transition-all text-center"
            >
              Ask a Question
            </a>
          </div>

          {/* FAQ */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="font-heading font-semibold text-2xl text-[#0D1B2A] mb-6">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              {FAQ_ITEMS.map((faq, idx) => (
                <div key={idx} className="border-b border-[#1F7A8C]/10 last:border-b-0">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full py-4 flex justify-between items-center text-left hover:text-[#1F7A8C] transition-colors"
                    aria-expanded={openFaqIndex === idx}
                  >
                    <span className="font-heading font-semibold text-lg text-[#0D1B2A]">
                      {faq.question}
                    </span>
                    <svg 
                      className={`w-5 h-5 text-[#1F7A8C] transition-transform ${openFaqIndex === idx ? 'rotate-180' : ''}`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFaqIndex === idx && (
                    <div className="pb-4 font-body text-[#1A1A1A]/70 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading font-bold text-3xl sm:text-4xl text-[#0D1B2A] mb-4">
            Keep in Touch
          </h2>
          <p className="font-body text-[#1A1A1A]/70 mb-8">
            Occasional updates, no spam. Hear about new residents, events, and the momentum we&apos;re building.
          </p>
          
          <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 px-6 py-3 rounded-full border-2 border-[#1F7A8C]/20 focus:border-[#1F7A8C] focus:outline-none font-body"
                required
              />
              <button
                type="submit"
                className="px-8 py-3 bg-[#1F7A8C] text-white rounded-full font-medium hover:bg-[#0D1B2A] transition-all whitespace-nowrap"
              >
                Join Newsletter
              </button>
            </div>
            {emailStatus === 'success' && (
              <p className="mt-4 text-[#6C8C64] font-medium">
                Thanks — we&apos;ll be in touch soon.
              </p>
            )}
            {emailStatus === 'error' && (
              <p className="mt-4 text-red-500 font-medium">
                Please enter a valid email.
              </p>
            )}
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D1B2A] text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-heading font-bold text-xl mb-4">Billabong House</h3>
              <p className="font-body text-white/70 text-sm mb-4">
                A riverfront residency for builders, researchers, and creators. Part of the Arrayah network.
              </p>
              <p className="font-body text-white/70 text-sm">
                Drummoyne, NSW<br />
                <a href={CONFIG.contact_url} className="ripple-underline hover:text-white">
                  hello@billabong.house
                </a>
              </p>
            </div>
            
            <div>
              <h4 className="font-heading font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 font-body text-sm">
                <li><a href="#hero" className="ripple-underline text-white/70 hover:text-white">Home</a></li>
                <li><a href="#about" className="ripple-underline text-white/70 hover:text-white">About</a></li>
                <li><a href="#residency" className="ripple-underline text-white/70 hover:text-white">Residency</a></li>
                <li><a href={CONFIG.events_url} className="ripple-underline text-white/70 hover:text-white">Events</a></li>
                <li><a href={CONFIG.apply_url} className="ripple-underline text-white/70 hover:text-white">Apply</a></li>
              </ul>
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
