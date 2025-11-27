'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCreateHomie } from '@/hooks/useHomies';
import { useCreateVisit, useVisitHistory } from '@/hooks/useVisits';
import { useOnboardingFlow } from '@/hooks/useOnboardingFlow';
import { useProfileImageUpload } from '@/hooks/useProfileImageUpload';
import { mapFormDataToHomieInsert, type PersonalInfo, type ProfileQuestions } from '@/schemas/homie-schema';
import { mapHomieResultToData } from '@/utils/onboarding/onboarding-helpers';
import { HomieResult } from '@/utils/onboarding/onboarding-types';

// Layout components
import { OnboardingLayout } from './components/layout';

// Step components
import {
  WelcomeStep,
  ReturningCheckStep,
  HouseRulesStep,
  PersonalInfoStep,
  ProfilePictureStep,
  ProfileQuestionsStep,
  CompleteStep,
} from './components/steps';

type CodeStatus = 'validating' | 'valid' | 'invalid' | 'expired' | 'missing';

export default function WelcomePage() {
  const searchParams = useSearchParams();
  const [codeStatus, setCodeStatus] = useState<CodeStatus>('validating');

  // Validate the welcome code on mount
  useEffect(() => {
    const code = searchParams.get('code');

    if (!code) {
      setCodeStatus('missing');
      return;
    }

    const validateCode = async () => {
      try {
        const response = await fetch('/api/validate-welcome-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        const data = await response.json();

        if (data.valid) {
          setCodeStatus('valid');
        } else if (data.error === 'Code has expired') {
          setCodeStatus('expired');
        } else {
          setCodeStatus('invalid');
        }
      } catch {
        setCodeStatus('invalid');
      }
    };

    validateCode();
  }, [searchParams]);

  const {
    step,
    setStep,
    isReturning,
    setIsReturning,
    homieData,
    updateHomieData,
    profileImageBlob,
    setProfileImageBlob,
    visitCreatedRef,
    resetVisitCreationFlag,
  } = useOnboardingFlow();

  const createHomie = useCreateHomie();
  const createVisit = useCreateVisit();
  const visitHistory = useVisitHistory();
  const { uploading: uploadingImage, uploadImage } = useProfileImageUpload();

  // Warn user before leaving if they have unsaved progress
  useEffect(() => {
    const shouldWarn = step !== 'welcome' && step !== 'complete';

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (shouldWarn) {
        e.preventDefault();
        return '';
      }
    };

    if (shouldWarn) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [step]);

  // ========== Event Handlers ==========

  const handleReturningGuest = () => {
    setStep('returning-check');
  };

  const handleNewGuest = () => {
    setStep('rules');
  };

  const handleHomieSelected = (homie: HomieResult) => {
    resetVisitCreationFlag();
    visitHistory.fetch(homie.id);
    
    const mappedData = mapHomieResultToData(homie);
    updateHomieData(mappedData);
    setIsReturning(true);
  };

  const handleNotFound = (firstName: string, lastName: string) => {
    updateHomieData({ firstName, lastName });
    setStep('rules');
  };

  const handleRulesAccepted = (agreed: boolean) => {
    updateHomieData({ agreedToRules: agreed });
  };

  const handlePersonalInfoSubmit = (data: PersonalInfo) => {
    updateHomieData(data);
    setStep('profile-picture');
  };

  const handleImageCaptured = (blob: Blob) => {
    setProfileImageBlob(blob);
    setStep('profile-questions');
  };

  const handleSkipImage = () => {
    setProfileImageBlob(null);
    setStep('profile-questions');
  };

  const handleProfileQuestionsSubmit = async (data: ProfileQuestions) => {
    resetVisitCreationFlag();
    
    const completeData = { ...homieData, ...data };
    const insertData = mapFormDataToHomieInsert(completeData);
    
    await createHomie.create(insertData);
  };

  // ========== Side Effects ==========

  // Handle homie creation success - upload image then create visit
  useEffect(() => {
    if (createHomie.data && !createVisit.data && !createVisit.isPending && !visitCreatedRef.current) {
      visitCreatedRef.current = true;
      updateHomieData({ id: createHomie.data.id });
      
      if (profileImageBlob) {
        uploadImage(profileImageBlob, createHomie.data.id).then(() => {
          createVisit.create({
            homieId: createHomie.data!.id,
            purpose: createHomie.data!.why_billabong || undefined,
          });
        });
      } else {
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

  // ========== Render ==========

  // Show loading state while validating
  if (codeStatus === 'validating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto mb-4"></div>
          <p className="text-slate-300">Validating access...</p>
        </div>
      </div>
    );
  }

  // Show access denied for invalid/missing/expired codes
  if (codeStatus !== 'valid') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 max-w-md text-center border border-slate-700">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-slate-400 mb-6">
            {codeStatus === 'missing' && 'A valid welcome code is required to access this page.'}
            {codeStatus === 'expired' && 'This welcome code has expired. Please request a new one.'}
            {codeStatus === 'invalid' && 'The welcome code provided is invalid.'}
          </p>
          <p className="text-slate-500 text-sm">
            Contact a Billabong resident if you need access.
          </p>
        </div>
      </div>
    );
  }

  return (
    <OnboardingLayout step={step}>
      {step === 'welcome' && (
        <WelcomeStep
          onReturningGuest={handleReturningGuest}
          onNewGuest={handleNewGuest}
        />
      )}

      {step === 'returning-check' && (
        <ReturningCheckStep
          onHomieSelected={handleHomieSelected}
          onNotFound={handleNotFound}
          onBack={() => setStep('welcome')}
          onStartOnboarding={() => setStep('rules')}
        />
      )}

      {step === 'rules' && (
        <HouseRulesStep
          agreedToRules={homieData.agreedToRules}
          onAgreedChange={handleRulesAccepted}
          onBack={() => setStep('welcome')}
          onContinue={() => setStep('personal-info')}
        />
      )}

      {step === 'personal-info' && (
        <PersonalInfoStep
          defaultValues={{
            firstName: homieData.firstName,
            lastName: homieData.lastName,
            email: homieData.email,
            github: homieData.github,
            linkedin: homieData.linkedin,
            instagram: homieData.instagram,
            xHandle: homieData.xHandle,
            website: homieData.website,
          }}
          onSubmit={handlePersonalInfoSubmit}
          onBack={() => setStep('rules')}
        />
      )}

      {step === 'profile-picture' && (
        <ProfilePictureStep
          onImageCaptured={handleImageCaptured}
          onSkip={handleSkipImage}
          onBack={() => setStep('personal-info')}
          uploadingImage={uploadingImage}
        />
      )}

      {step === 'profile-questions' && (
        <ProfileQuestionsStep
          onSubmit={handleProfileQuestionsSubmit}
          onBack={() => setStep('profile-picture')}
          loading={createHomie.isPending || createVisit.isPending || uploadingImage}
          error={createHomie.error}
        />
      )}

      {step === 'complete' && (
        <CompleteStep
          homieData={homieData}
          isReturning={isReturning}
          visitCount={visitHistory.data?.totalVisits}
        />
      )}
    </OnboardingLayout>
  );
}
