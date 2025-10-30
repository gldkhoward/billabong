'use client';

import { useEffect } from 'react';
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

export default function WelcomePage() {
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
