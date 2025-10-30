/**
 * Shared TypeScript types for the onboarding flow
 */

export type OnboardingStep = 
  | 'welcome' 
  | 'returning-check' 
  | 'rules' 
  | 'personal-info' 
  | 'profile-picture'
  | 'profile-questions' 
  | 'complete';

export type HomieData = {
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

export type HomieResult = {
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

export type StepNavigationProps = {
  onBack?: () => void;
  onContinue?: () => void;
  continueDisabled?: boolean;
  continueText?: string;
  backText?: string;
  loading?: boolean;
  showBack?: boolean;
  showContinue?: boolean;
};

