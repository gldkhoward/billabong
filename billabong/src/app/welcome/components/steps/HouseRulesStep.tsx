/**
 * House rules step - display guidelines and get agreement
 */

import { StepNavigation } from '../layout/StepNavigation';

type HouseRulesStepProps = {
  agreedToRules: boolean;
  onAgreedChange: (agreed: boolean) => void;
  onBack: () => void;
  onContinue: () => void;
};

const HOUSE_RULES = [
  {
    icon: '🤝',
    title: 'respect the space',
    description: 'clean up after yourself. this is everyone\'s home.'
  },
  {
    icon: '🏠',
    title: 'residents first',
    description: 'be mindful that this is a home first, coworking + events space second.'
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
    description: 'upper levels are for residents only unless you are invited or accompanied by a resident.'
  },
  {
    icon: '🍳',
    title: 'kitchen access',
    description: 'ask before using kitchen. clean up thoroughly after.'
  },
];

export function HouseRulesStep({
  agreedToRules,
  onAgreedChange,
  onBack,
  onContinue,
}: HouseRulesStepProps) {
  return (
    <div className="animate-fade-in pb-4">
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
          {HOUSE_RULES.map((rule, idx) => (
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
              checked={agreedToRules}
              onChange={(e) => onAgreedChange(e.target.checked)}
              className="mt-1 w-5 h-5 rounded border-2 border-river-teal text-river-teal focus:ring-river-teal cursor-pointer"
            />
            <span className="font-body text-charcoal group-hover:text-river-teal transition-colors">
              I understand and agree to follow these guidelines during my visit
            </span>
          </label>
        </div>
      </div>

      <StepNavigation
        onBack={onBack}
        onContinue={onContinue}
        continueDisabled={!agreedToRules}
      />
    </div>
  );
}

