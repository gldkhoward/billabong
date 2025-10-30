/**
 * Custom hook to manage onboarding flow state
 */

import { useState, useRef } from 'react';
import { OnboardingStep, HomieData } from '@/utils/onboarding/onboarding-types';

export function useOnboardingFlow() {
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [isReturning, setIsReturning] = useState(false);
  const [homieData, setHomieData] = useState<HomieData>({
    firstName: '',
    lastName: '',
    agreedToRules: false,
  });
  const [profileImageBlob, setProfileImageBlob] = useState<Blob | null>(null);
  
  // Track if we've already triggered visit creation to prevent duplicates
  const visitCreatedRef = useRef(false);

  const updateHomieData = (updates: Partial<HomieData>) => {
    setHomieData((prev) => ({ ...prev, ...updates }));
  };

  const resetVisitCreationFlag = () => {
    visitCreatedRef.current = false;
  };

  const goToStep = (newStep: OnboardingStep) => {
    setStep(newStep);
  };

  return {
    step,
    setStep: goToStep,
    isReturning,
    setIsReturning,
    homieData,
    setHomieData,
    updateHomieData,
    profileImageBlob,
    setProfileImageBlob,
    visitCreatedRef,
    resetVisitCreationFlag,
  };
}

