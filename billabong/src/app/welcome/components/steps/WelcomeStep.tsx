/**
 * Welcome step - first screen with two paths (returning/new guest)
 */

import Image from 'next/image';

type WelcomeStepProps = {
  onReturningGuest: () => void;
  onNewGuest: () => void;
};

export function WelcomeStep({ onReturningGuest, onNewGuest }: WelcomeStepProps) {
  return (
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
          onClick={onReturningGuest}
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
          onClick={onNewGuest}
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
  );
}

