/**
 * Returning guest check step - search for existing guest
 */

import { useEffect } from 'react';
import { useHomieSearch } from '@/hooks/useHomieSearch';
import { HomieResult } from '@/utils/onboarding/onboarding-types';
import { parseNameFromSearch } from '@/utils/onboarding/onboarding-helpers';

type ReturningCheckStepProps = {
  onHomieSelected: (homie: HomieResult) => void;
  onNotFound: (firstName: string, lastName: string) => void;
  onBack: () => void;
  onStartOnboarding: () => void;
};

export function ReturningCheckStep({
  onHomieSelected,
  onNotFound,
  onBack,
  onStartOnboarding,
}: ReturningCheckStepProps) {
  const {
    isLoading,
    searchQuery,
    setSearchQuery,
    showDropdown,
    setShowDropdown,
    filteredHomies,
    fetchHomies,
    resetSearch,
  } = useHomieSearch();

  // Fetch homies when component mounts
  useEffect(() => {
    fetchHomies();
  }, [fetchHomies]);

  const handleNotFound = () => {
    const { firstName, lastName } = parseNameFromSearch(searchQuery);
    onNotFound(firstName, lastName);
  };

  const handleBack = () => {
    resetSearch();
    onBack();
  };

  // Handle Enter key in search field
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      e.preventDefault();
      if (filteredHomies.length > 0) {
        // Select the first result
        onHomieSelected(filteredHomies[0]);
      } else {
        // No matches - trigger "Continue as New Guest"
        handleNotFound();
      }
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="text-center mb-8 sm:mb-12 px-2">
        <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl text-deep-indigo mb-3 sm:mb-4">
          welcome back!
        </h1>
        <p className="font-body text-base sm:text-lg text-charcoal/80">
          {isLoading ? 'loading guests...' : 'search for your name'}
        </p>
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-8 md:p-12 shadow-xl max-w-2xl mx-auto">
        <div className="relative autocomplete-container">
          <label className="block font-heading font-semibold text-base sm:text-lg text-deep-indigo mb-2">
            What&apos;s your name?
          </label>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Start typing your name..."
            disabled={isLoading}
            className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-river-teal/30 rounded-xl font-body text-base sm:text-lg focus:border-river-teal focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          />

          {/* Autocomplete Dropdown */}
          {showDropdown && searchQuery.trim() && (
            <div className="absolute z-50 w-full mt-2 bg-white border-2 border-river-teal/30 rounded-xl shadow-2xl max-h-60 sm:max-h-80 overflow-y-auto">
              {filteredHomies.length > 0 ? (
                <div className="py-1 sm:py-2">
                  {filteredHomies.map((homie) => (
                    <button
                      key={homie.id}
                      type="button"
                      onClick={() => onHomieSelected(homie)}
                      className="w-full px-4 sm:px-6 py-3 sm:py-4 text-left hover:bg-river-teal/10 transition-colors border-b border-river-teal/10 last:border-0"
                    >
                      <div className="font-heading font-semibold text-base sm:text-lg text-deep-indigo">
                        {homie.first_name} {homie.last_name}
                      </div>
                      {homie.where_from && (
                        <div className="text-xs sm:text-sm text-charcoal/60 mt-1">
                          from {homie.where_from}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-6 sm:py-8 px-4 sm:px-6 text-center">
                  <p className="text-charcoal/60 font-body text-sm sm:text-base mb-3 sm:mb-4">
                    No matches found for &quot;{searchQuery}&quot;
                  </p>
                  <button
                    type="button"
                    onClick={handleNotFound}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-river-teal text-white rounded-xl font-heading text-sm sm:text-base font-semibold hover:bg-deep-indigo transition-all"
                  >
                    Continue as New Guest
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8">
          <button
            type="button"
            onClick={handleBack}
            className="flex-1 px-4 sm:px-6 py-3 sm:py-4 border-2 border-river-teal text-river-teal rounded-xl font-heading text-sm sm:text-base font-semibold hover:bg-river-teal hover:text-white transition-all"
          >
            Back
          </button>
        </div>

        <button
          type="button"
          onClick={onStartOnboarding}
          className="w-full mt-6 text-sm text-charcoal/60 hover:text-river-teal transition-colors"
        >
          First time? Start onboarding →
        </button>
      </div>
    </div>
  );
}

