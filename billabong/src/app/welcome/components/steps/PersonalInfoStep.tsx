/**
 * Personal info step - collect basic information and social links
 */

import { useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { personalInfoSchema, type PersonalInfo } from '@/schemas/homie-schema';
import { FormField } from '@/app/components/FormField';
import { StepNavigation } from '../layout/StepNavigation';

type PersonalInfoStepProps = {
  defaultValues: PersonalInfo;
  onSubmit: (data: PersonalInfo) => void;
  onBack: () => void;
};

type FieldName = keyof PersonalInfo;

export function PersonalInfoStep({ defaultValues, onSubmit, onBack }: PersonalInfoStepProps) {
  const form = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues,
  });

  const submitButtonRef = useRef<HTMLButtonElement>(null);

  // Handle Enter key navigation using React Hook Form's setFocus
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, nextField?: FieldName) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextField) {
        form.setFocus(nextField);
      } else {
        // Focus submit button if no next field
        submitButtonRef.current?.focus();
      }
    }
  };

  return (
    <div className="animate-fade-in pb-4">
      <div className="text-center mb-8 sm:mb-12 px-2">
        <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-deep-indigo mb-3 sm:mb-4">
          tell us about you
        </h1>
        <p className="font-body text-base sm:text-lg text-charcoal/80">
          help us and other guests connect with you
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="bg-white rounded-2xl p-4 sm:p-8 md:p-12 shadow-xl mb-6 sm:mb-8">
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid sm:grid-cols-2 gap-6">
            <FormField
              label="First Name"
              required
              placeholder="Your first name"
              error={form.formState.errors.firstName?.message}
              {...form.register('firstName')}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, 'lastName')}
            />
            <FormField
              label="Last Name"
              required
              placeholder="Your last name"
              error={form.formState.errors.lastName?.message}
              {...form.register('lastName')}
              onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, 'email')}
            />
          </div>

          <FormField
            label="Email"
            type="email"
            placeholder="your.email@example.com"
            error={form.formState.errors.email?.message}
            {...form.register('email')}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, 'github')}
          />

          {/* Social Links */}
          <div className="pt-4">
            <h3 className="font-heading font-semibold text-xl text-deep-indigo mb-4">
              Connect with you
            </h3>
            <div className="grid sm:grid-cols-2 gap-6">
              <FormField
                label="GitHub"
                placeholder="username"
                error={form.formState.errors.github?.message}
                {...form.register('github')}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, 'linkedin')}
              />

              <FormField
                label="LinkedIn"
                placeholder="username"
                error={form.formState.errors.linkedin?.message}
                {...form.register('linkedin')}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, 'instagram')}
              />

              <FormField
                label="Instagram"
                prefix="@"
                placeholder="username"
                error={form.formState.errors.instagram?.message}
                {...form.register('instagram')}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, 'xHandle')}
              />

              <FormField
                label="X (Twitter)"
                prefix="@"
                placeholder="username"
                error={form.formState.errors.xHandle?.message}
                {...form.register('xHandle')}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, 'website')}
              />

              <FormField
                label="Website"
                type="url"
                placeholder="https://yoursite.com"
                error={form.formState.errors.website?.message}
                {...form.register('website')}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e)}
              />
            </div>
          </div>
        </div>

        <StepNavigation
          onBack={onBack}
          onContinue={() => {}} // Form submission handles this
          showContinue={false} // We use the submit button instead
        />

        <button
          ref={submitButtonRef}
          type="submit"
          className="w-full mt-3 sm:mt-4 px-4 sm:px-6 py-3 sm:py-4 bg-river-teal text-white rounded-xl font-heading text-sm sm:text-base font-semibold hover:bg-deep-indigo transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </form>
    </div>
  );
}

