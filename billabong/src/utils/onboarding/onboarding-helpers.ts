/**
 * Utility functions for onboarding flow
 */

import { OnboardingStep, HomieResult, HomieData } from './onboarding-types';

/**
 * Calculate progress percentage based on current step
 */
export function getProgressPercentage(step: OnboardingStep): number {
  const steps: OnboardingStep[] = [
    'welcome', 
    'rules', 
    'personal-info', 
    'profile-picture', 
    'profile-questions', 
    'complete'
  ];
  const currentIndex = steps.indexOf(step);
  if (currentIndex === -1) return 0;
  return ((currentIndex + 1) / steps.length) * 100;
}

/**
 * Check if step should show progress bar
 */
export function shouldShowProgress(step: OnboardingStep): boolean {
  return step !== 'welcome' && step !== 'complete';
}

/**
 * Convert HomieResult (database format) to HomieData (form format)
 */
export function mapHomieResultToData(homie: HomieResult): Partial<HomieData> {
  return {
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
  };
}

/**
 * Parse search query into first and last name
 */
export function parseNameFromSearch(searchQuery: string): { firstName: string; lastName: string } {
  const names = searchQuery.split(' ');
  const firstName = names[0] || '';
  const lastName = names.slice(1).join(' ') || '';
  return { firstName, lastName };
}

