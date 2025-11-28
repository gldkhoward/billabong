/**
 * Complete step - success screen with visit stats and next steps
 */

import Link from 'next/link';
import { HomieData } from '@/utils/onboarding/onboarding-types';

type CompleteStepProps = {
  homieData: HomieData;
  isReturning: boolean;
  visitCount?: number;
  guestsToday?: number;
  hereNow?: number;
};

export function CompleteStep({ homieData, isReturning, visitCount, guestsToday, hereNow }: CompleteStepProps) {
  return (
    <div className="animate-fade-in text-center">
      <div className="bg-white rounded-2xl p-4 sm:p-8 md:p-12 shadow-xl max-w-2xl mx-auto">
        <div className="text-5xl sm:text-6xl mb-4 sm:mb-6">✅</div>
        <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-deep-indigo mb-3 sm:mb-4 px-2">
          you&apos;re all set!
        </h1>
        
        {isReturning && visitCount !== undefined ? (
          <div className="mb-6 sm:mb-8 px-2">
            <p className="font-body text-lg sm:text-xl text-charcoal/80 mb-4 sm:mb-6">
              welcome back, <span className="font-semibold text-river-teal">{homieData.firstName} {homieData.lastName}</span>! 
            </p>
            <div className="bg-river-teal/10 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
              <p className="font-body text-sm sm:text-base text-charcoal/70">
                <span className="font-semibold">Visit #{visitCount + 1}</span>
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

        <div className="space-y-2 sm:space-y-3">
          <Link
            href="/house-rules"
            className="block px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-river-teal text-river-teal rounded-xl font-heading text-sm sm:text-base font-semibold hover:bg-river-teal hover:text-white transition-all"
          >
            Review House Rules
          </Link>
          <Link
            href="/residents"
            className="block px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-river-teal text-river-teal rounded-xl font-heading text-sm sm:text-base font-semibold hover:bg-river-teal hover:text-white transition-all"
          >
            Meet the Residents
          </Link>
          <Link
            href="/"
            className="block px-4 sm:px-6 py-2.5 sm:py-3 bg-river-teal text-white rounded-xl font-heading text-sm sm:text-base font-semibold hover:bg-deep-indigo transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>

      {/* Fun Stats Section */}
      {(visitCount !== undefined || guestsToday !== undefined || hereNow !== undefined) && (
        <div className="mt-8 sm:mt-12 grid grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow">
            <div className="text-2xl sm:text-3xl font-bold text-river-teal">
              {visitCount !== undefined ? visitCount + 1 : '-'}
            </div>
            <div className="text-xs sm:text-sm text-charcoal/60 font-body">
              {isReturning ? 'your visits' : 'your visit'}
            </div>
          </div>
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow">
            <div className="text-2xl sm:text-3xl font-bold text-river-teal">
              {guestsToday !== undefined ? guestsToday : '-'}
            </div>
            <div className="text-xs sm:text-sm text-charcoal/60 font-body">guests today</div>
          </div>
          <div className="bg-white rounded-xl p-3 sm:p-4 shadow">
            <div className="text-2xl sm:text-3xl font-bold text-river-teal">
              {hereNow !== undefined ? hereNow : '-'}
            </div>
            <div className="text-xs sm:text-sm text-charcoal/60 font-body">here now</div>
          </div>
        </div>
      )}
    </div>
  );
}

