'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Image from 'next/image';
import { getAllHomies } from '@/actions/homie-actions';
import { 
  personalInfoSchema, 
  profileQuestionsSchema,
  mapFormDataToHomieInsert,
  type PersonalInfo,
  type ProfileQuestions,
} from '@/schemas/homie-schema';
import { useCreateHomie } from '@/hooks/useHomies';
import { useCreateVisit, useVisitHistory } from '@/hooks/useVisits';
import { FormField } from '@/app/components/FormField';
import { ProfileImageCapture } from '@/app/components/ProfileImageCapture';

type OnboardingStep = 
  | 'welcome' 
  | 'returning-check' 
  | 'rules' 
  | 'personal-info' 
  | 'profile-picture'
  | 'profile-questions' 
  | 'complete';

type HomieData = {
  id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
  xHandle?: string;
  website?: string;
  homieImageUrl?: string;
  childhoodDream?: string;
  whyBillabong?: string;
  whereFrom?: string;
  workingOn?: string;
  howToHelp?: string;
  agreedToRules: boolean;
};

type HomieResult = {
  id: string;
  first_name: string;
  last_name: string;
  github_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  x_handle: string | null;
  website_url: string | null;
  where_from: string | null;
  why_billabong: string | null;
  working_on: string | null;
  how_to_help: string | null;
  agreed_to_rules: boolean;
  created_at: string;
  updated_at: string;
};

export default function GuestsPage() {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [isReturning, setIsReturning] = useState(false);
  const [allHomies, setAllHomies] = useState<HomieResult[]>([]);
  const [isLoadingHomies, setIsLoadingHomies] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [homieData, setHomieData] = useState<HomieData>({
    firstName: '',
    lastName: '',
    agreedToRules: false,
  });
  const [profileImageBlob, setProfileImageBlob] = useState<Blob | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Hooks
  const createHomie = useCreateHomie();
  const createVisit = useCreateVisit();
  const visitHistory = useVisitHistory();
  
  // Track if we've already triggered visit creation to prevent duplicates
  const visitCreatedRef = useRef(false);

  // Form for personal info
  const personalInfoForm = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: homieData.firstName,
      lastName: homieData.lastName,
    },
  });

  // Form for profile questions
  const profileForm = useForm<ProfileQuestions>({
    resolver: zodResolver(profileQuestionsSchema),
  });

  // Fetch all homies when entering returning-check step
  useEffect(() => {
    if (step === 'returning-check' && allHomies.length === 0 && !isLoadingHomies) {
      setIsLoadingHomies(true);
      getAllHomies().then((result) => {
        if (result.success) {
          setAllHomies(result.data);
        }
        setIsLoadingHomies(false);
      });
    }
  }, [step, allHomies.length, isLoadingHomies]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showDropdown && !target.closest('.autocomplete-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  // Filter homies based on search query (client-side)
  const filteredHomies = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    
    const query = searchQuery.toLowerCase();
    return allHomies.filter((homie) => {
      const fullName = `${homie.first_name} ${homie.last_name}`.toLowerCase();
      return fullName.includes(query);
    }).slice(0, 10); // Limit to 10 results
  }, [searchQuery, allHomies]);

  // Handle homie selection from dropdown
  const handleSelectHomie = (homie: HomieResult) => {
    // Reset visit creation tracker
    visitCreatedRef.current = false;
    
    // Load visit history
    visitHistory.fetch(homie.id);
    
    setHomieData({
      id: homie.id,
      firstName: homie.first_name,
      lastName: homie.last_name,
      github: homie.github_url || undefined,
      linkedin: homie.linkedin_url || undefined,
      instagram: homie.instagram_url || undefined,
      xHandle: homie.x_handle || undefined,
      website: homie.website_url || undefined,
      whereFrom: homie.where_from || undefined,
      whyBillabong: homie.why_billabong || undefined,
      workingOn: homie.working_on || undefined,
      howToHelp: homie.how_to_help || undefined,
      agreedToRules: homie.agreed_to_rules,
    });
    setIsReturning(true);
    setShowDropdown(false);
    setSearchQuery('');
  };

  // Handle "not found" - proceed to new guest flow
  const handleNotFound = () => {
    const names = searchQuery.split(' ');
    const firstName = names[0] || '';
    const lastName = names.slice(1).join(' ') || '';
    
    setHomieData((prev) => ({ ...prev, firstName, lastName }));
    personalInfoForm.setValue('firstName', firstName);
    personalInfoForm.setValue('lastName', lastName);
    setStep('rules');
    setSearchQuery('');
    setShowDropdown(false);
  };

  // Handle personal info submission
  const onPersonalInfoSubmit = (data: PersonalInfo) => {
    setHomieData({
      ...homieData,
      ...data,
    });
    setStep('profile-picture');
  };

  // Handle profile image captured
  const handleImageCaptured = (blob: Blob) => {
    setProfileImageBlob(blob);
    setStep('profile-questions');
  };

  // Handle skip profile image
  const handleSkipImage = () => {
    setProfileImageBlob(null);
    setStep('profile-questions');
  };

  // Upload profile image
  const uploadProfileImage = async (homieId: string): Promise<string | null> => {
    if (!profileImageBlob) return null;

    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', profileImageBlob, 'profile.jpg');
      formData.append('homieId', homieId);

      const response = await fetch('/api/upload-profile-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      return result.url;
    } catch (error) {
      console.error('Image upload error:', error);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle profile questions submission
  const onProfileSubmit = async (data: ProfileQuestions) => {
    // Reset visit creation tracker before creating new homie
    visitCreatedRef.current = false;
    
    const completeData = { ...homieData, ...data };
    
    // Map form data to database format
    const insertData = mapFormDataToHomieInsert(completeData);
    
    // Create homie first
    await createHomie.create(insertData);
  };

  // Handle homie creation success - upload image then create visit
  useEffect(() => {
    if (createHomie.data && !createVisit.data && !createVisit.isPending && !visitCreatedRef.current) {
      visitCreatedRef.current = true;
      setHomieData(prev => ({ ...prev, id: createHomie.data!.id }));
      
      // Upload profile image if available
      if (profileImageBlob) {
        uploadProfileImage(createHomie.data.id).then(() => {
          // Create visit record after image upload (or skip if failed)
          createVisit.create({
            homieId: createHomie.data!.id,
            purpose: createHomie.data!.why_billabong || undefined,
          });
        });
      } else {
        // Create visit record immediately if no image
        createVisit.create({
          homieId: createHomie.data.id,
          purpose: createHomie.data.why_billabong || undefined,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createHomie.data]);

  // Handle returning guest check-in
  useEffect(() => {
    if (isReturning && homieData.id && visitHistory.data && !createVisit.data && !createVisit.isPending && !visitCreatedRef.current) {
      visitCreatedRef.current = true;
      // Create visit for returning guest
      createVisit.create({
        homieId: homieData.id,
        purpose: 'Returning visit',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReturning, homieData.id, visitHistory.data?.totalVisits]);

  // Handle visit creation success
  useEffect(() => {
    if (createVisit.data && step !== 'complete') {
      setStep('complete');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createVisit.data]);

  // Progress indicator
  const getProgress = () => {
    const steps: OnboardingStep[] = ['welcome', 'rules', 'personal-info', 'profile-picture', 'profile-questions', 'complete'];
    const currentIndex = steps.indexOf(step);
    return ((currentIndex + 1) / steps.length) * 100;
  };

  return (
    <div className="water-dots h-screen flex flex-col overflow-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-foam/90 backdrop-blur-sm border-b border-river-teal/10 shrink-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="font-heading font-bold text-xl text-deep-indigo">
              billabong
            </Link>
            <Link 
              href="/"
              className="text-sm font-medium text-charcoal hover:text-river-teal transition-colors"
            >
              ← back
            </Link>
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      {step !== 'welcome' && step !== 'complete' && (
        <div className="sticky top-16 z-40 bg-foam/90 backdrop-blur-sm shrink-0">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="w-full bg-river-teal/20 rounded-full h-2">
              <div 
                className="bg-river-teal h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${getProgress()}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto py-4 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-4xl mx-auto w-full">
          
          {/* Welcome Step */}
          {step === 'welcome' && (
            <div className="text-center animate-fade-in">
              <div className="mb-6 sm:mb-8">
                <Image 
                  src="/arrayh_logo.jpg" 
                  alt="Billabong House" 
                  width={80} 
                  height={80}
                  className="mx-auto rounded-2xl shadow-xl sm:w-[100px] sm:h-[100px]"
                />
              </div>
              <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-deep-indigo mb-4 sm:mb-6 px-2">
                welcome to billabong 🌊
              </h1>
              <p className="font-body text-base sm:text-lg md:text-xl text-charcoal/80 mb-8 sm:mb-12 max-w-2xl mx-auto leading-relaxed px-4">
                we&apos;re excited to have you here. let&apos;s get you set up and checked in.
              </p>

              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
                <button
                  onClick={() => setStep('returning-check')}
                  className="group bg-white rounded-2xl p-6 sm:p-8 border-2 border-river-teal hover:border-deep-indigo transition-all hover:shadow-xl"
                >
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">👋</div>
                  <h2 className="font-heading font-semibold text-xl sm:text-2xl text-deep-indigo mb-2 sm:mb-3">
                    returning guest
                  </h2>
                  <p className="font-body text-sm sm:text-base text-charcoal/70">
                    quick check-in if you&apos;ve been here before
                  </p>
                </button>

                <button
                  onClick={() => setStep('rules')}
                  className="group bg-white rounded-2xl p-6 sm:p-8 border-2 border-eucalyptus hover:border-deep-indigo transition-all hover:shadow-xl"
                >
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">✨</div>
                  <h2 className="font-heading font-semibold text-xl sm:text-2xl text-deep-indigo mb-2 sm:mb-3">
                    first time here
                  </h2>
                  <p className="font-body text-sm sm:text-base text-charcoal/70">
                    let&apos;s get you onboarded
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* Returning Guest Check */}
          {step === 'returning-check' && (
            <div className="animate-fade-in">
              <div className="text-center mb-8 sm:mb-12 px-2">
                <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-deep-indigo mb-3 sm:mb-4">
                  welcome back!
                </h1>
                <p className="font-body text-base sm:text-lg text-charcoal/80">
                  {isLoadingHomies ? 'loading guests...' : 'search for your name'}
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 sm:p-8 md:p-12 shadow-xl max-w-2xl mx-auto">
                <div className="relative autocomplete-container">
                  <label className="block font-heading font-semibold text-lg text-deep-indigo mb-2">
                    What&apos;s your name?
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Start typing your name..."
                    disabled={isLoadingHomies}
                    className="w-full px-6 py-4 border-2 border-river-teal/30 rounded-xl font-body text-lg focus:border-river-teal focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />

                  {/* Autocomplete Dropdown */}
                  {showDropdown && searchQuery.trim() && (
                    <div className="absolute z-50 w-full mt-2 bg-white border-2 border-river-teal/30 rounded-xl shadow-2xl max-h-60 sm:max-h-80 overflow-y-auto">
                      {filteredHomies.length > 0 ? (
                        <div className="py-1 sm:py-2">
                          {filteredHomies.map((homie) => (
                            <button
                              key={homie.id}
                              type="button"
                              onClick={() => handleSelectHomie(homie)}
                              className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left hover:bg-river-teal/10 transition-colors border-b border-river-teal/10 last:border-0"
                            >
                              <div className="font-heading font-semibold text-base sm:text-lg text-deep-indigo">
                                {homie.first_name} {homie.last_name}
                              </div>
                              {homie.where_from && (
                                <div className="text-xs sm:text-sm text-charcoal/60 mt-1">
                                  from {homie.where_from}
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="py-6 sm:py-8 px-4 sm:px-6 text-center">
                          <p className="text-charcoal/60 font-body text-sm sm:text-base mb-3 sm:mb-4">
                            No matches found for &quot;{searchQuery}&quot;
                          </p>
                          <button
                            type="button"
                            onClick={handleNotFound}
                            className="px-4 sm:px-6 py-2 sm:py-3 bg-river-teal text-white rounded-xl font-heading text-sm sm:text-base font-semibold hover:bg-deep-indigo transition-all"
                          >
                            Continue as New Guest
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => {
                      setStep('welcome');
                      setSearchQuery('');
                      setShowDropdown(false);
                      setAllHomies([]);
                      setIsLoadingHomies(false);
                    }}
                    className="flex-1 px-6 py-4 border-2 border-river-teal text-river-teal rounded-xl font-heading font-semibold hover:bg-river-teal hover:text-white transition-all"
                  >
                    Back
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setStep('rules');
                    setSearchQuery('');
                    setShowDropdown(false);
                  }}
                  className="w-full mt-6 text-sm text-charcoal/60 hover:text-river-teal transition-colors"
                >
                  First time? Start onboarding →
                </button>
              </div>
            </div>
          )}

          {/* House Rules Step */}
          {step === 'rules' && (
            <div className="animate-fade-in">
              <div className="text-center mb-8 sm:mb-12 px-2">
                <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-deep-indigo mb-3 sm:mb-4">
                  house guidelines
                </h1>
                <p className="font-body text-base sm:text-lg text-charcoal/80">
                  a few simple principles to help everyone thrive
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 sm:p-8 md:p-12 shadow-xl mb-6 sm:mb-8">
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
                    <div key={idx} className="flex gap-3 sm:gap-4 items-start">
                      <div className="text-2xl sm:text-3xl shrink-0">{rule.icon}</div>
                      <div>
                        <h3 className="font-heading font-semibold text-base sm:text-lg text-deep-indigo mb-1">
                          {rule.title}
                        </h3>
                        <p className="font-body text-sm sm:text-base text-charcoal/70">
                          {rule.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-river-teal/10 pt-6">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={homieData.agreedToRules}
                      onChange={(e) => setHomieData({ ...homieData, agreedToRules: e.target.checked })}
                      className="mt-1 w-5 h-5 rounded border-2 border-river-teal text-river-teal focus:ring-river-teal cursor-pointer"
                    />
                    <span className="font-body text-charcoal group-hover:text-river-teal transition-colors">
                      I understand and agree to follow these guidelines during my visit
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep('welcome')}
                  className="flex-1 px-6 py-4 border-2 border-river-teal text-river-teal rounded-xl font-heading font-semibold hover:bg-river-teal hover:text-white transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('personal-info')}
                  disabled={!homieData.agreedToRules}
                  className="flex-1 px-6 py-4 bg-river-teal text-white rounded-xl font-heading font-semibold hover:bg-deep-indigo transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Personal Info Step */}
          {step === 'personal-info' && (
            <div className="animate-fade-in">
              <div className="text-center mb-8 sm:mb-12 px-2">
                <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-deep-indigo mb-3 sm:mb-4">
                  tell us about you
                </h1>
                <p className="font-body text-base sm:text-lg text-charcoal/80">
                  help us and other guests connect with you
                </p>
              </div>

              <form onSubmit={personalInfoForm.handleSubmit(onPersonalInfoSubmit)} className="bg-white rounded-2xl p-4 sm:p-8 md:p-12 shadow-xl mb-6 sm:mb-8">
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid sm:grid-cols-2 gap-6">
                    <FormField
                      label="First Name"
                      required
                      placeholder="Your first name"
                      error={personalInfoForm.formState.errors.firstName?.message}
                      {...personalInfoForm.register('firstName')}
                    />
                    <FormField
                      label="Last Name"
                      required
                      placeholder="Your last name"
                      error={personalInfoForm.formState.errors.lastName?.message}
                      {...personalInfoForm.register('lastName')}
                    />
                  </div>

                  <FormField
                    label="Email"
                    type="email"
                    placeholder="your.email@example.com"
                    error={personalInfoForm.formState.errors.email?.message}
                    {...personalInfoForm.register('email')}
                  />

                  {/* Social Links */}
                  <div className="pt-4">
                    <h3 className="font-heading font-semibold text-xl text-deep-indigo mb-4">
                      Connect with you
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <FormField
                        label="GitHub"
                        placeholder="username"
                        error={personalInfoForm.formState.errors.github?.message}
                        {...personalInfoForm.register('github')}
                      />

                      <FormField
                        label="LinkedIn"
                        placeholder="username"
                        error={personalInfoForm.formState.errors.linkedin?.message}
                        {...personalInfoForm.register('linkedin')}
                      />

                      <FormField
                        label="Instagram"
                        prefix="@"
                        placeholder="username"
                        error={personalInfoForm.formState.errors.instagram?.message}
                        {...personalInfoForm.register('instagram')}
                      />

                      <FormField
                        label="X (Twitter)"
                        prefix="@"
                        placeholder="username"
                        error={personalInfoForm.formState.errors.xHandle?.message}
                        {...personalInfoForm.register('xHandle')}
                      />

                      <FormField
                        label="Website"
                        type="url"
                        placeholder="https://yoursite.com"
                        error={personalInfoForm.formState.errors.website?.message}
                        {...personalInfoForm.register('website')}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setStep('rules')}
                    className="flex-1 px-6 py-4 border-2 border-river-teal text-river-teal rounded-xl font-heading font-semibold hover:bg-river-teal hover:text-white transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-4 bg-river-teal text-white rounded-xl font-heading font-semibold hover:bg-deep-indigo transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Profile Picture Step */}
          {step === 'profile-picture' && (
            <div className="animate-fade-in">
              <div className="text-center mb-8 sm:mb-12 px-2">
                <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-deep-indigo mb-3 sm:mb-4">
                  add your photo 📸
                </h1>
                <p className="font-body text-base sm:text-lg text-charcoal/80">
                  snap a quick photo somewhere in the house
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 sm:p-8 md:p-12 shadow-xl mb-6 sm:mb-8 max-w-2xl mx-auto">
                <ProfileImageCapture
                  onImageCaptured={handleImageCaptured}
                  onSkip={handleSkipImage}
                />

                {uploadingImage && (
                  <div className="mt-6 text-center">
                    <p className="font-body text-sm text-charcoal/70">
                      Uploading your photo...
                    </p>
                  </div>
                )}

                <div className="mt-8">
                  <button
                    type="button"
                    onClick={() => setStep('personal-info')}
                    className="w-full px-6 py-4 border-2 border-river-teal text-river-teal rounded-xl font-heading font-semibold hover:bg-river-teal hover:text-white transition-all"
                  >
                    ← Back
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Profile Questions Step */}
          {step === 'profile-questions' && (
            <div className="animate-fade-in">
              <div className="text-center mb-8 sm:mb-12 px-2">
                <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-deep-indigo mb-3 sm:mb-4">
                  your story
                </h1>
                <p className="font-body text-base sm:text-lg text-charcoal/80">
                  help the community get to know you better
                </p>
              </div>

              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="bg-white rounded-2xl p-4 sm:p-8 md:p-12 shadow-xl mb-6 sm:mb-8">
                <div className="space-y-8">
                  <FormField
                    label="What did you want to be when you grew up?"
                    placeholder="An astronaut, artist, inventor..."
                    error={profileForm.formState.errors.childhoodDream?.message}
                    {...profileForm.register('childhoodDream')}
                  />

                  <FormField
                    label="Where are you from?"
                    placeholder="City, country, or wherever you call home"
                    error={profileForm.formState.errors.whereFrom?.message}
                    {...profileForm.register('whereFrom')}
                  />

                  <FormField
                    label="Why did you come to Billabong?"
                    type="textarea"
                    required
                    placeholder="What brought you here today?"
                    rows={3}
                    error={profileForm.formState.errors.whyBillabong?.message}
                    {...profileForm.register('whyBillabong')}
                  />

                  <FormField
                    label="What are you working on?"
                    type="textarea"
                    required
                    placeholder="Your current project, research, or creative work"
                    rows={3}
                    error={profileForm.formState.errors.workingOn?.message}
                    {...profileForm.register('workingOn')}
                  />

                  <FormField
                    label="How can others help?"
                    type="textarea"
                    placeholder="Intros, feedback, collaboration opportunities..."
                    rows={3}
                    error={profileForm.formState.errors.howToHelp?.message}
                    {...profileForm.register('howToHelp')}
                  />
                </div>

                {createHomie.error && (
                  <p className="mt-6 text-sm text-red-500 font-body">
                    Error: {createHomie.error}
                  </p>
                )}

                <div className="flex gap-4 mt-8">
                  <button
                    type="button"
                    onClick={() => setStep('profile-picture')}
                    disabled={createHomie.isPending}
                    className="flex-1 px-6 py-4 border-2 border-river-teal text-river-teal rounded-xl font-heading font-semibold hover:bg-river-teal hover:text-white transition-all disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={createHomie.isPending || createVisit.isPending || uploadingImage}
                    className="flex-1 px-6 py-4 bg-river-teal text-white rounded-xl font-heading font-semibold hover:bg-deep-indigo transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingImage ? 'Uploading Photo...' : createHomie.isPending ? 'Saving...' : 'Complete Check-In'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Complete Step */}
          {step === 'complete' && (
            <div className="animate-fade-in text-center">
              <div className="bg-white rounded-2xl p-4 sm:p-8 md:p-12 shadow-xl max-w-2xl mx-auto">
                <div className="text-5xl sm:text-6xl mb-4 sm:mb-6">✅</div>
                <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-deep-indigo mb-3 sm:mb-4 px-2">
                  you&apos;re all set!
                </h1>
                
                {isReturning && visitHistory.data ? (
                  <div className="mb-6 sm:mb-8 px-2">
                    <p className="font-body text-lg sm:text-xl text-charcoal/80 mb-4 sm:mb-6">
                      welcome back, <span className="font-semibold text-river-teal">{homieData.firstName} {homieData.lastName}</span>! 
                    </p>
                    <div className="bg-river-teal/10 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                      <p className="font-body text-sm sm:text-base text-charcoal/70">
                        <span className="font-semibold">Visit #{visitHistory.data.totalVisits + 1}</span>
                      </p>
                    </div>
                    <p className="font-body text-base sm:text-lg text-charcoal/70">
                      you&apos;re checked in and ready to work. make yourself at home! 🌊
                    </p>
                  </div>
                ) : (
                  <div className="mb-6 sm:mb-8 px-2">
                    <p className="font-body text-lg sm:text-xl text-charcoal/80 mb-4 sm:mb-6">
                      welcome, <span className="font-semibold text-river-teal">{homieData.firstName} {homieData.lastName}</span>!
                    </p>
                    <p className="font-body text-base sm:text-lg text-charcoal/70 mb-3 sm:mb-4">
                      you&apos;re checked in and ready to start building. 
                    </p>
                    <p className="font-body text-sm sm:text-base text-charcoal/70">
                      your profile has been created. next time you visit, just enter your name for quick check-in!
                    </p>
                  </div>
                )}

                <div className="bg-sand/20 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-eucalyptus/20">
                  <p className="font-heading font-semibold text-base sm:text-lg text-deep-indigo mb-2 sm:mb-3">
                    🌐 WiFi Access
                  </p>
                  <p className="font-body text-sm sm:text-base text-charcoal/70 mb-2">
                    Network: <span className="font-mono font-semibold text-river-teal text-sm sm:text-base">billabong_homies</span>
                  </p>
                  <p className="font-body text-sm sm:text-base text-charcoal/70">
                    Password: <span className="font-mono font-semibold text-river-teal text-sm sm:text-base">billabong1</span>
                  </p>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/house-rules"
                    className="block px-6 py-3 border-2 border-river-teal text-river-teal rounded-xl font-heading font-semibold hover:bg-river-teal hover:text-white transition-all"
                  >
                    Review House Rules
                  </Link>
                  <Link
                    href="/residents"
                    className="block px-6 py-3 border-2 border-river-teal text-river-teal rounded-xl font-heading font-semibold hover:bg-river-teal hover:text-white transition-all"
                  >
                    Meet the Residents
                  </Link>
                  <Link
                    href="/"
                    className="block px-6 py-4 bg-river-teal text-white rounded-xl font-heading font-semibold hover:bg-deep-indigo transition-all"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>

              {/* Fun Stats Section */}
              {visitHistory.data && (
                <div className="mt-12 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="bg-white rounded-xl p-4 shadow">
                    <div className="text-3xl font-bold text-river-teal">
                      {visitHistory.data.totalVisits + 1}
                    </div>
                    <div className="text-sm text-charcoal/60 font-body">
                      total visits
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow">
                    <div className="text-3xl font-bold text-river-teal">47</div>
                    <div className="text-sm text-charcoal/60 font-body">guests today</div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow">
                    <div className="text-3xl font-bold text-river-teal">12</div>
                    <div className="text-sm text-charcoal/60 font-body">here now</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-river-teal/10 py-4 px-4 bg-foam sticky bottom-0 shrink-0">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-body text-sm text-charcoal/50">
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
