# Welcome / Onboarding Flow

This directory contains the refactored onboarding flow for Billabong guests. The code has been restructured for better maintainability, testability, and mobile responsiveness.

## Architecture Overview

### 📁 Directory Structure

```
welcome/
├── page.tsx                      # Main orchestrator (180 lines vs 938 lines before)
├── components/
│   ├── layout/                   # Reusable layout components
│   │   ├── OnboardingLayout.tsx  # Main wrapper with nav, progress, footer
│   │   ├── ProgressBar.tsx       # Progress indicator
│   │   ├── StepNavigation.tsx    # Reusable back/continue buttons
│   │   └── index.ts             # Barrel export
│   └── steps/                    # Individual step components
│       ├── WelcomeStep.tsx       # Initial welcome screen
│       ├── ReturningCheckStep.tsx # Guest search with autocomplete
│       ├── HouseRulesStep.tsx    # Rules display and agreement
│       ├── PersonalInfoStep.tsx  # Personal info form
│       ├── ProfilePictureStep.tsx # Photo capture
│       ├── ProfileQuestionsStep.tsx # Profile questions
│       ├── CompleteStep.tsx      # Success screen
│       └── index.ts             # Barrel export
└── README.md                     # This file
```

### 🪝 Custom Hooks

Located in `/src/hooks/`:

- **`useOnboardingFlow`** - Centralized flow state management

  - Manages step navigation
  - Handles guest data state
  - Tracks profile image blob
  - Prevents duplicate visit creation

- **`useHomieSearch`** - Autocomplete search logic

  - Fetches all guests
  - Filters based on search query
  - Manages dropdown visibility
  - Handles click-outside behavior

- **`useProfileImageUpload`** - Image upload handling
  - Uploads profile images to API
  - Manages upload state and errors
  - Provides loading indicators

### 🛠️ Utilities

Located in `/src/utils/onboarding/`:

- **`onboarding-types.ts`** - Shared TypeScript types

  - `OnboardingStep` - Step identifier union type
  - `HomieData` - Form data structure
  - `HomieResult` - Database result structure
  - `StepNavigationProps` - Navigation component props

- **`onboarding-helpers.ts`** - Utility functions
  - `getProgressPercentage()` - Calculate progress bar %
  - `shouldShowProgress()` - Determine if progress bar should show
  - `mapHomieResultToData()` - Convert DB format to form format
  - `parseNameFromSearch()` - Parse name from search query

## Mobile Responsiveness

### ✅ Key Mobile Features

1. **Responsive Breakpoints**

   - `sm:` (640px) - Small tablets and large phones
   - `md:` (768px) - Tablets
   - `lg:` (1024px) - Desktop

2. **Touch Targets**

   - All buttons: min 44px height (iOS/Android guidelines)
   - Increased padding on mobile: `py-3 sm:py-4`

3. **Typography**

   - Headings scale: `text-3xl sm:text-4xl md:text-5xl`
   - Body text: `text-base sm:text-lg`
   - Ensures readability on all devices

4. **Camera UI**

   - Uses mobile-optimized `getUserMedia`
   - Includes `facingMode: 'user'` for front camera
   - Square crop overlay with responsive sizing
   - `playsInline` attribute for iOS

5. **Forms**

   - Single column on mobile, grid on desktop
   - Input fields sized appropriately
   - Error messages clearly visible

6. **Autocomplete Dropdown**

   - `max-h-60 sm:max-h-80` prevents viewport overflow
   - Touch-friendly list items
   - Proper z-index layering

7. **Spacing & Layout**
   - Reduced padding on mobile: `p-4 sm:p-8 md:p-12`
   - Flexible gap sizes: `gap-3 sm:gap-4`
   - Content stays within safe viewport bounds

## Flow Logic

### New Guest Flow

1. Welcome → Rules → Personal Info → Profile Picture → Questions → Complete

### Returning Guest Flow

1. Welcome → Search → (Match found) → Complete
2. Welcome → Search → (No match) → Rules → ... (continues as new guest)

## Key Improvements

### 🎯 Maintainability

- **Reduced complexity**: Main file went from 938 → 180 lines
- **Separation of concerns**: Each step is isolated
- **Reusable components**: Layout and navigation shared across steps
- **Type safety**: Comprehensive TypeScript types

### 🧪 Testability

- Each step component can be tested in isolation
- Hooks can be tested independently
- Clear prop interfaces for mocking
- No deeply nested logic

### 📱 Mobile UX

- Verified responsive breakpoints throughout
- Touch-friendly interface elements
- Optimized camera capture for mobile devices
- Proper viewport handling

### 🔄 Reusability

- `StepNavigation` used across multiple steps
- `OnboardingLayout` provides consistent wrapper
- Hooks can be reused in other features
- Helper functions are pure and portable

## Usage Example

```tsx
import { WelcomeStep } from "./components/steps";

<WelcomeStep onReturningGuest={() => setStep("returning-check")} onNewGuest={() => setStep("rules")} />;
```

## Future Enhancements

- [ ] Add unit tests for each component
- [ ] Add integration tests for full flow
- [ ] Extract animation styles to shared CSS
- [ ] Add analytics tracking to each step
- [ ] Consider URL-based routing for steps (deep linking)
- [ ] Add ability to save progress and resume later
