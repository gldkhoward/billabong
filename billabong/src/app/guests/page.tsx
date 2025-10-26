'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type OnboardingStep = 
  | 'welcome' 
  | 'returning-check' 
  | 'rules' 
  | 'personal-info' 
  | 'profile-questions' 
  | 'complete';

interface GuestData {
  name: string;
  github: string;
  linkedin: string;
  instagram: string;
  website: string;
  childhoodDream: string;
  whyBillabong: string;
  whereFrom: string;
  workingOn: string;
  howToHelp: string;
  agreedToRules: boolean;
}

export default function GuestsPage() {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [isReturning, setIsReturning] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [guestData, setGuestData] = useState<GuestData>({
    name: '',
    github: '',
    linkedin: '',
    instagram: '',
    website: '',
    childhoodDream: '',
    whyBillabong: '',
    whereFrom: '',
    workingOn: '',
    howToHelp: '',
    agreedToRules: false,
  });

  // Mock returning user data (would come from database)
  const mockReturningUser = {
    name: 'Alex Chen',
    visitCount: 3,
    lastVisit: '2 weeks ago',
  };

  const handleReturningCheckIn = () => {
    // This would check the database in real implementation
    if (searchName.toLowerCase().includes('alex')) {
      setIsReturning(true);
      setStep('complete');
    } else {
      // Not found, proceed with new onboarding
      setGuestData({ ...guestData, name: searchName });
      setStep('rules');
    }
  };

  const updateGuestData = (field: keyof GuestData, value: string | boolean) => {
    setGuestData({ ...guestData, [field]: value });
  };

  const canProceedFromPersonalInfo = () => {
    return guestData.name.trim().length > 0;
  };

  const canProceedFromProfile = () => {
    return (
      guestData.whyBillabong.trim().length > 0 &&
      guestData.workingOn.trim().length > 0
    );
  };

  // Progress indicator
  const getProgress = () => {
    const steps: OnboardingStep[] = ['welcome', 'rules', 'personal-info', 'profile-questions', 'complete'];
    const currentIndex = steps.indexOf(step);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  return (
    <div className="water-dots min-h-screen">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#F7F8F5]/90 backdrop-blur-sm border-b border-[#1F7A8C]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="font-heading font-bold text-xl text-[#0D1B2A]">
              billabong
            </Link>
            <Link 
              href="/"
              className="text-sm font-medium text-[#1A1A1A] hover:text-[#1F7A8C] transition-colors"
            >
              ← back
            </Link>
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      {step !== 'welcome' && step !== 'complete' && (
        <div className="sticky top-16 z-40 bg-[#F7F8F5]/90 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="w-full bg-[#1F7A8C]/20 rounded-full h-2">
              <div 
                className="bg-[#1F7A8C] h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <main className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Welcome Step */}
          {step === 'welcome' && (
            <div className="text-center animate-fade-in">
              <div className="mb-8">
                <Image 
                  src="/arrayh_logo.jpg" 
                  alt="Billabong House" 
                  width={100} 
                  height={100}
                  className="mx-auto rounded-2xl shadow-xl"
                />
              </div>
              <h1 className="font-heading font-bold text-4xl sm:text-5xl lg:text-6xl text-[#0D1B2A] mb-6">
                welcome to billabong 🌊
              </h1>
              <p className="font-body text-lg sm:text-xl text-[#1A1A1A]/80 mb-12 max-w-2xl mx-auto leading-relaxed">
                we&apos;re excited to have you here. let&apos;s get you set up and checked in.
              </p>

              <div className="grid sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <button
                  onClick={() => setStep('returning-check')}
                  className="group bg-white rounded-2xl p-8 border-2 border-[#1F7A8C] hover:border-[#0D1B2A] transition-all hover:shadow-xl"
                >
                  <div className="text-4xl mb-4">👋</div>
                  <h2 className="font-heading font-semibold text-2xl text-[#0D1B2A] mb-3">
                    returning guest
                  </h2>
                  <p className="font-body text-[#1A1A1A]/70">
                    quick check-in if you&apos;ve been here before
                  </p>
                </button>

                <button
                  onClick={() => setStep('rules')}
                  className="group bg-white rounded-2xl p-8 border-2 border-[#6C8C64] hover:border-[#0D1B2A] transition-all hover:shadow-xl"
                >
                  <div className="text-4xl mb-4">✨</div>
                  <h2 className="font-heading font-semibold text-2xl text-[#0D1B2A] mb-3">
                    first time here
                  </h2>
                  <p className="font-body text-[#1A1A1A]/70">
                    let&apos;s get you onboarded
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Returning Guest Check */}
          {step === 'returning-check' && (
            <div className="animate-fade-in">
              <div className="text-center mb-12">
                <h1 className="font-heading font-bold text-4xl sm:text-5xl text-[#0D1B2A] mb-4">
                  welcome back!
                </h1>
                <p className="font-body text-lg text-[#1A1A1A]/80">
                  enter your name to check in
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl max-w-2xl mx-auto">
                <label className="block font-heading font-semibold text-lg text-[#0D1B2A] mb-4">
                  What&apos;s your name?
                </label>
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Enter your first and last name"
                  className="w-full px-6 py-4 border-2 border-[#1F7A8C]/30 rounded-xl font-body text-lg focus:border-[#1F7A8C] focus:outline-none transition-all mb-6"
                  onKeyPress={(e) => e.key === 'Enter' && searchName.trim() && handleReturningCheckIn()}
                />

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep('welcome')}
                    className="flex-1 px-6 py-4 border-2 border-[#1F7A8C] text-[#1F7A8C] rounded-xl font-heading font-semibold hover:bg-[#1F7A8C] hover:text-white transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleReturningCheckIn}
                    disabled={!searchName.trim()}
                    className="flex-1 px-6 py-4 bg-[#1F7A8C] text-white rounded-xl font-heading font-semibold hover:bg-[#0D1B2A] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Check In
                  </button>
                </div>

                <button
                  onClick={() => setStep('rules')}
                  className="w-full mt-6 text-sm text-[#1A1A1A]/60 hover:text-[#1F7A8C] transition-colors"
                >
                  First time? Start onboarding →
                </button>
              </div>
            </div>
          )}

          {/* House Rules Step */}
          {step === 'rules' && (
            <div className="animate-fade-in">
              <div className="text-center mb-12">
                <h1 className="font-heading font-bold text-4xl sm:text-5xl text-[#0D1B2A] mb-4">
                  house guidelines
                </h1>
                <p className="font-body text-lg text-[#1A1A1A]/80">
                  a few simple principles to help everyone thrive
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl mb-8">
                <div className="space-y-6 mb-8">
                  {[
                    {
                      icon: '🤝',
                      title: 'respect the space',
                      description: 'clean up after yourself. this is everyone&apos;s home.'
                    },
                    {
                      icon: '🏠',
                      title: 'residents first',
                      description: 'be mindful that this is a home first, coworking space second.'
                    },
                    {
                      icon: '🎧',
                      title: 'respect focus',
                      description: 'headphones mean do not disturb. respect the flow state.'
                    },
                    {
                      icon: '🤫',
                      title: 'quiet coworking',
                      description: 'keep noise minimal in work areas. take calls outside.'
                    },
                    {
                      icon: '🔒',
                      title: 'resident zones',
                      description: 'upper levels are for residents only unless invited.'
                    },
                    {
                      icon: '🍳',
                      title: 'kitchen access',
                      description: 'ask before using kitchen. clean up thoroughly after.'
                    },
                  ].map((rule, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="text-3xl flex-shrink-0">{rule.icon}</div>
                      <div>
                        <h3 className="font-heading font-semibold text-lg text-[#0D1B2A] mb-1">
                          {rule.title}
                        </h3>
                        <p className="font-body text-[#1A1A1A]/70">
                          {rule.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#1F7A8C]/10 pt-6">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={guestData.agreedToRules}
                      onChange={(e) => updateGuestData('agreedToRules', e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-2 border-[#1F7A8C] text-[#1F7A8C] focus:ring-[#1F7A8C] cursor-pointer"
                    />
                    <span className="font-body text-[#1A1A1A] group-hover:text-[#1F7A8C] transition-colors">
                      I understand and agree to follow these guidelines during my visit
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep('welcome')}
                  className="flex-1 px-6 py-4 border-2 border-[#1F7A8C] text-[#1F7A8C] rounded-xl font-heading font-semibold hover:bg-[#1F7A8C] hover:text-white transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('personal-info')}
                  disabled={!guestData.agreedToRules}
                  className="flex-1 px-6 py-4 bg-[#1F7A8C] text-white rounded-xl font-heading font-semibold hover:bg-[#0D1B2A] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Personal Info Step */}
          {step === 'personal-info' && (
            <div className="animate-fade-in">
              <div className="text-center mb-12">
                <h1 className="font-heading font-bold text-4xl sm:text-5xl text-[#0D1B2A] mb-4">
                  tell us about you
                </h1>
                <p className="font-body text-lg text-[#1A1A1A]/80">
                  help us and other guests connect with you
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl mb-8">
                <div className="space-y-6">
                  <div>
                    <label className="block font-heading font-semibold text-lg text-[#0D1B2A] mb-2">
                      Full Name <span className="text-[#1F7A8C]">*</span>
                    </label>
                    <input
                      type="text"
                      value={guestData.name}
                      onChange={(e) => updateGuestData('name', e.target.value)}
                      placeholder="Your name"
                      className="w-full px-4 py-3 border-2 border-[#1F7A8C]/30 rounded-xl font-body focus:border-[#1F7A8C] focus:outline-none transition-all"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-heading font-semibold text-[#0D1B2A] mb-2">
                        GitHub
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-[#1A1A1A]/40">github.com/</span>
                        <input
                          type="text"
                          value={guestData.github}
                          onChange={(e) => updateGuestData('github', e.target.value)}
                          placeholder="username"
                          className="w-full pl-28 pr-4 py-3 border-2 border-[#1F7A8C]/30 rounded-xl font-body focus:border-[#1F7A8C] focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-heading font-semibold text-[#0D1B2A] mb-2">
                        LinkedIn
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-[#1A1A1A]/40">linkedin.com/in/</span>
                        <input
                          type="text"
                          value={guestData.linkedin}
                          onChange={(e) => updateGuestData('linkedin', e.target.value)}
                          placeholder="username"
                          className="w-full pl-36 pr-4 py-3 border-2 border-[#1F7A8C]/30 rounded-xl font-body focus:border-[#1F7A8C] focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-heading font-semibold text-[#0D1B2A] mb-2">
                        Instagram
                      </label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-[#1A1A1A]/40">@</span>
                        <input
                          type="text"
                          value={guestData.instagram}
                          onChange={(e) => updateGuestData('instagram', e.target.value)}
                          placeholder="username"
                          className="w-full pl-10 pr-4 py-3 border-2 border-[#1F7A8C]/30 rounded-xl font-body focus:border-[#1F7A8C] focus:outline-none transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-heading font-semibold text-[#0D1B2A] mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        value={guestData.website}
                        onChange={(e) => updateGuestData('website', e.target.value)}
                        placeholder="https://yoursite.com"
                        className="w-full px-4 py-3 border-2 border-[#1F7A8C]/30 rounded-xl font-body focus:border-[#1F7A8C] focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep('rules')}
                  className="flex-1 px-6 py-4 border-2 border-[#1F7A8C] text-[#1F7A8C] rounded-xl font-heading font-semibold hover:bg-[#1F7A8C] hover:text-white transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('profile-questions')}
                  disabled={!canProceedFromPersonalInfo()}
                  className="flex-1 px-6 py-4 bg-[#1F7A8C] text-white rounded-xl font-heading font-semibold hover:bg-[#0D1B2A] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Profile Questions Step */}
          {step === 'profile-questions' && (
            <div className="animate-fade-in">
              <div className="text-center mb-12">
                <h1 className="font-heading font-bold text-4xl sm:text-5xl text-[#0D1B2A] mb-4">
                  your story
                </h1>
                <p className="font-body text-lg text-[#1A1A1A]/80">
                  help the community get to know you better
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl mb-8">
                <div className="space-y-8">
                  <div>
                    <label className="block font-heading font-semibold text-lg text-[#0D1B2A] mb-2">
                      What did you want to be when you grew up?
                    </label>
                    <input
                      type="text"
                      value={guestData.childhoodDream}
                      onChange={(e) => updateGuestData('childhoodDream', e.target.value)}
                      placeholder="An astronaut, artist, inventor..."
                      className="w-full px-4 py-3 border-2 border-[#1F7A8C]/30 rounded-xl font-body focus:border-[#1F7A8C] focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-heading font-semibold text-lg text-[#0D1B2A] mb-2">
                      Where are you from?
                    </label>
                    <input
                      type="text"
                      value={guestData.whereFrom}
                      onChange={(e) => updateGuestData('whereFrom', e.target.value)}
                      placeholder="City, country, or wherever you call home"
                      className="w-full px-4 py-3 border-2 border-[#1F7A8C]/30 rounded-xl font-body focus:border-[#1F7A8C] focus:outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block font-heading font-semibold text-lg text-[#0D1B2A] mb-2">
                      Why did you come to Billabong? <span className="text-[#1F7A8C]">*</span>
                    </label>
                    <textarea
                      value={guestData.whyBillabong}
                      onChange={(e) => updateGuestData('whyBillabong', e.target.value)}
                      placeholder="What brought you here today?"
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-[#1F7A8C]/30 rounded-xl font-body focus:border-[#1F7A8C] focus:outline-none transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block font-heading font-semibold text-lg text-[#0D1B2A] mb-2">
                      What are you working on? <span className="text-[#1F7A8C]">*</span>
                    </label>
                    <textarea
                      value={guestData.workingOn}
                      onChange={(e) => updateGuestData('workingOn', e.target.value)}
                      placeholder="Your current project, research, or creative work"
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-[#1F7A8C]/30 rounded-xl font-body focus:border-[#1F7A8C] focus:outline-none transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="block font-heading font-semibold text-lg text-[#0D1B2A] mb-2">
                      How can others help?
                    </label>
                    <textarea
                      value={guestData.howToHelp}
                      onChange={(e) => updateGuestData('howToHelp', e.target.value)}
                      placeholder="Intros, feedback, collaboration opportunities..."
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-[#1F7A8C]/30 rounded-xl font-body focus:border-[#1F7A8C] focus:outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep('personal-info')}
                  className="flex-1 px-6 py-4 border-2 border-[#1F7A8C] text-[#1F7A8C] rounded-xl font-heading font-semibold hover:bg-[#1F7A8C] hover:text-white transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('complete')}
                  disabled={!canProceedFromProfile()}
                  className="flex-1 px-6 py-4 bg-[#1F7A8C] text-white rounded-xl font-heading font-semibold hover:bg-[#0D1B2A] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Complete Check-In
                </button>
              </div>
            </div>
          )}

          {/* Complete Step */}
          {step === 'complete' && (
            <div className="animate-fade-in text-center">
              <div className="bg-white rounded-2xl p-8 sm:p-12 shadow-xl max-w-2xl mx-auto">
                <div className="text-6xl mb-6">✅</div>
                <h1 className="font-heading font-bold text-4xl sm:text-5xl text-[#0D1B2A] mb-4">
                  you&apos;re all set!
                </h1>
                
                {isReturning ? (
                  <div className="mb-8">
                    <p className="font-body text-xl text-[#1A1A1A]/80 mb-6">
                      welcome back, <span className="font-semibold text-[#1F7A8C]">{mockReturningUser.name}</span>! 
                    </p>
                    <div className="bg-[#1F7A8C]/10 rounded-xl p-6 mb-6">
                      <p className="font-body text-[#1A1A1A]/70">
                        <span className="font-semibold">Visit #{mockReturningUser.visitCount}</span> · Last here {mockReturningUser.lastVisit}
                      </p>
                    </div>
                    <p className="font-body text-lg text-[#1A1A1A]/70">
                      you&apos;re checked in and ready to work. make yourself at home! 🌊
                    </p>
                  </div>
                ) : (
                  <div className="mb-8">
                    <p className="font-body text-xl text-[#1A1A1A]/80 mb-6">
                      welcome, <span className="font-semibold text-[#1F7A8C]">{guestData.name}</span>!
                    </p>
                    <p className="font-body text-lg text-[#1A1A1A]/70 mb-4">
                      you&apos;re checked in and ready to start building. 
                    </p>
                    <p className="font-body text-[#1A1A1A]/70">
                      your profile has been created. next time you visit, just enter your name for quick check-in!
                    </p>
                  </div>
                )}

                <div className="bg-[#E9DCC2]/20 rounded-xl p-6 mb-8 border border-[#6C8C64]/20">
                  <p className="font-heading font-semibold text-lg text-[#0D1B2A] mb-3">
                    🌐 WiFi Access
                  </p>
                  <p className="font-body text-[#1A1A1A]/70 mb-2">
                    Network: <span className="font-mono font-semibold text-[#1F7A8C]">billabong_homies</span>
                  </p>
                  <p className="font-body text-[#1A1A1A]/70">
                    Password: <span className="font-mono font-semibold text-[#1F7A8C]">billabong1</span>
                  </p>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/house-rules"
                    className="block px-6 py-3 border-2 border-[#1F7A8C] text-[#1F7A8C] rounded-xl font-heading font-semibold hover:bg-[#1F7A8C] hover:text-white transition-all"
                  >
                    Review House Rules
                  </Link>
                  <Link
                    href="/residents"
                    className="block px-6 py-3 border-2 border-[#1F7A8C] text-[#1F7A8C] rounded-xl font-heading font-semibold hover:bg-[#1F7A8C] hover:text-white transition-all"
                  >
                    Meet the Residents
                  </Link>
                  <Link
                    href="/"
                    className="block px-6 py-4 bg-[#1F7A8C] text-white rounded-xl font-heading font-semibold hover:bg-[#0D1B2A] transition-all"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>

              {/* Fun Stats Section */}
              <div className="mt-12 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="bg-white rounded-xl p-4 shadow">
                  <div className="text-3xl font-bold text-[#1F7A8C]">
                    {isReturning ? mockReturningUser.visitCount : 1}
                  </div>
                  <div className="text-sm text-[#1A1A1A]/60 font-body">
                    {isReturning ? 'total visits' : 'first visit!'}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow">
                  <div className="text-3xl font-bold text-[#1F7A8C]">47</div>
                  <div className="text-sm text-[#1A1A1A]/60 font-body">guests today</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow">
                  <div className="text-3xl font-bold text-[#1F7A8C]">12</div>
                  <div className="text-sm text-[#1A1A1A]/60 font-body">here now</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#1F7A8C]/10 py-8 px-4 bg-[#F7F8F5] mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-body text-sm text-[#1A1A1A]/50">
            © {new Date().getFullYear()} billabong. part of arrayah.
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

