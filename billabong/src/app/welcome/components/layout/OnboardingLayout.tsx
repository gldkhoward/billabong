/**
 * Main layout wrapper for onboarding flow
 */

import Link from 'next/link';
import { ProgressBar } from './ProgressBar';
import { shouldShowProgress, getProgressPercentage } from '@/utils/onboarding/onboarding-helpers';
import { OnboardingStep } from '@/utils/onboarding/onboarding-types';

type OnboardingLayoutProps = {
  step: OnboardingStep;
  children: React.ReactNode;
};

export function OnboardingLayout({ step, children }: OnboardingLayoutProps) {
  const showProgress = shouldShowProgress(step);
  const progress = getProgressPercentage(step);

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
      {showProgress && <ProgressBar progress={progress} />}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto py-4 sm:py-8 md:py-12 px-3 sm:px-4 md:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-4xl mx-auto w-full h-full">
          {children}
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

      {/* Animation styles */}
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

        :global(.animate-fade-in) {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

