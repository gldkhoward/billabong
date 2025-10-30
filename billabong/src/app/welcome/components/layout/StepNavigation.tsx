/**
 * Reusable navigation buttons for onboarding steps
 */

import { StepNavigationProps } from '@/utils/onboarding/onboarding-types';

export function StepNavigation({
  onBack,
  onContinue,
  continueDisabled = false,
  continueText = 'Continue',
  backText = 'Back',
  loading = false,
  showBack = true,
  showContinue = true,
}: StepNavigationProps) {
  return (
    <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8">
      {showBack && onBack && (
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="flex-1 px-4 sm:px-6 py-3 sm:py-4 border-2 border-river-teal text-river-teal rounded-xl font-heading text-sm sm:text-base font-semibold hover:bg-river-teal hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {backText}
        </button>
      )}
      {showContinue && onContinue && (
        <button
          type="button"
          onClick={onContinue}
          disabled={continueDisabled || loading}
          className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-river-teal text-white rounded-xl font-heading text-sm sm:text-base font-semibold hover:bg-deep-indigo transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : continueText}
        </button>
      )}
    </div>
  );
}

