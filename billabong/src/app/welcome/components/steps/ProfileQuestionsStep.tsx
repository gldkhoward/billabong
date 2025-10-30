/**
 * Profile questions step - collect deeper profile information
 */

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileQuestionsSchema, type ProfileQuestions } from '@/schemas/homie-schema';
import { FormField } from '@/app/components/FormField';
import { StepNavigation } from '../layout/StepNavigation';

type ProfileQuestionsStepProps = {
  onSubmit: (data: ProfileQuestions) => void;
  onBack: () => void;
  loading?: boolean;
  error?: string | null;
};

export function ProfileQuestionsStep({
  onSubmit,
  onBack,
  loading = false,
  error = null,
}: ProfileQuestionsStepProps) {
  const form = useForm<ProfileQuestions>({
    resolver: zodResolver(profileQuestionsSchema),
  });

  return (
    <div className="animate-fade-in pb-4">
      <div className="text-center mb-8 sm:mb-12 px-2">
        <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-deep-indigo mb-3 sm:mb-4">
          your story
        </h1>
        <p className="font-body text-base sm:text-lg text-charcoal/80">
          help the community get to know you better
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white rounded-2xl p-4 sm:p-8 md:p-12 shadow-xl mb-6 sm:mb-8">
        <div className="space-y-8">
          <FormField
            label="What did you want to be when you grew up?"
            placeholder="An astronaut, artist, inventor..."
            error={form.formState.errors.childhoodDream?.message}
            {...form.register('childhoodDream')}
          />

          <FormField
            label="Where are you from?"
            placeholder="City, country, or wherever you call home"
            error={form.formState.errors.whereFrom?.message}
            {...form.register('whereFrom')}
          />

          <FormField
            label="Why did you come to Billabong?"
            type="textarea"
            required
            placeholder="What brought you here today?"
            rows={3}
            error={form.formState.errors.whyBillabong?.message}
            {...form.register('whyBillabong')}
          />

          <FormField
            label="What are you working on?"
            type="textarea"
            required
            placeholder="Your current project, research, or creative work"
            rows={3}
            error={form.formState.errors.workingOn?.message}
            {...form.register('workingOn')}
          />

          <FormField
            label="How can others help?"
            type="textarea"
            placeholder="Intros, feedback, collaboration opportunities..."
            rows={3}
            error={form.formState.errors.howToHelp?.message}
            {...form.register('howToHelp')}
          />
        </div>

        {error && (
          <p className="mt-6 text-sm text-red-500 font-body">
            Error: {error}
          </p>
        )}

        <StepNavigation
          onBack={onBack}
          onContinue={() => {}} // Form submission handles this
          showContinue={false} // We use the submit button instead
          loading={loading}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-3 sm:mt-4 px-4 sm:px-6 py-3 sm:py-4 bg-river-teal text-white rounded-xl font-heading text-sm sm:text-base font-semibold hover:bg-deep-indigo transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Complete'}
        </button>
      </form>
    </div>
  );
}

