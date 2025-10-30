/**
 * Profile picture step - capture or upload photo
 */

import { ProfileImageCapture } from '@/app/components/ProfileImageCapture';

type ProfilePictureStepProps = {
  onImageCaptured: (blob: Blob) => void;
  onSkip: () => void;
  onBack: () => void;
  uploadingImage?: boolean;
};

export function ProfilePictureStep({
  onImageCaptured,
  onSkip,
  onBack,
  uploadingImage = false,
}: ProfilePictureStepProps) {
  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8 sm:mb-12 px-2">
        <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-deep-indigo mb-3 sm:mb-4">
          add your photo 📸
        </h1>
        <p className="font-body text-base sm:text-lg text-charcoal/80">
          snap a quick photo somewhere in the house
        </p>
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-8 md:p-12 shadow-xl mb-6 sm:mb-8 max-w-2xl mx-auto">
        <ProfileImageCapture
          onImageCaptured={onImageCaptured}
          onSkip={onSkip}
        />

        {uploadingImage && (
          <div className="mt-6 text-center">
            <p className="font-body text-sm text-charcoal/70">
              Uploading your photo...
            </p>
          </div>
        )}

        <div className="mt-6 sm:mt-8">
          <button
            type="button"
            onClick={onBack}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-river-teal text-river-teal rounded-xl font-heading text-sm sm:text-base font-semibold hover:bg-river-teal hover:text-white transition-all"
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}

