/**
 * Progress bar component for onboarding flow
 */

type ProgressBarProps = {
  progress: number;
};

export function ProgressBar({ progress }: ProgressBarProps) {
  return (
    <div className="sticky top-16 z-40 bg-foam/90 backdrop-blur-sm shrink-0">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="w-full bg-river-teal/20 rounded-full h-2">
          <div 
            className="bg-river-teal h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

