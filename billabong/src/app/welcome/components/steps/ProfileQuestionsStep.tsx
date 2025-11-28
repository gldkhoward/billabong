/**
 * Profile questions step - collect deeper profile information
 */

import { useRef } from 'react';
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

type FieldName = keyof ProfileQuestions;

export function ProfileQuestionsStep({
  onSubmit,
  onBack,
  loading = false,
  error = null,
}: ProfileQuestionsStepProps) {
  const form = useForm<ProfileQuestions>({
    resolver: zodResolver(profileQuestionsSchema),
  });

  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // Handle Enter key navigation using React Hook Form's setFocus
  // For input fields: Enter moves to next
  // For textareas: Ctrl/Cmd+Enter moves to next (Enter creates new line)
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    nextField?: FieldName,
    isTextarea: boolean = false
  ) => {
    if (isTextarea) {
      // For textareas, only navigate on Ctrl+Enter or Cmd+Enter
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        if (nextField) {
          form.setFocus(nextField);
        } else {
          submitButtonRef.current?.focus();
        }
      }
    } else {
      // For regular inputs, navigate on Enter
      if (e.key === 'Enter') {
        e.preventDefault();
        if (nextField) {
          form.setFocus(nextField);
        } else {
          submitButtonRef.current?.focus();
        }
      }
    }
  };

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
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, 'whereFrom', false)}
          />

          <FormField
            label="Where are you from?"
            placeholder="City, country, or wherever you call home"
            error={form.formState.errors.whereFrom?.message}
            {...form.register('whereFrom')}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, 'whyBillabong', false)}
          />

          <FormField
            label="Why did you come to Billabong?"
            type="textarea"
            required
            placeholder="What brought you here today?"
            rows={3}
            error={form.formState.errors.whyBillabong?.message}
            {...form.register('whyBillabong')}
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => handleKeyDown(e, 'workingOn', true)}
          />

          <FormField
            label="What are you working on?"
            type="textarea"
            required
            placeholder="Your current project, research, or creative work"
            rows={3}
            error={form.formState.errors.workingOn?.message}
            {...form.register('workingOn')}
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => handleKeyDown(e, 'howToHelp', true)}
          />

          <FormField
            label="How can others help?"
            type="textarea"
            placeholder="Intros, feedback, collaboration opportunities..."
            rows={3}
            error={form.formState.errors.howToHelp?.message}
            {...form.register('howToHelp')}
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => handleKeyDown(e, undefined, true)}
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
          ref={submitButtonRef}
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

