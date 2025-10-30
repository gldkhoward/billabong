/**
 * Custom hook for searching and managing homie autocomplete
 */

import { useState, useEffect, useMemo } from 'react';
import { getAllHomies } from '@/actions/homie-actions';
import { HomieResult } from '@/utils/onboarding/onboarding-types';

export function useHomieSearch() {
  const [allHomies, setAllHomies] = useState<HomieResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Fetch all homies
  const fetchHomies = async () => {
    if (allHomies.length > 0 || isLoading) return;
    
    setIsLoading(true);
    const result = await getAllHomies();
    if (result.success) {
      setAllHomies(result.data);
    }
    setIsLoading(false);
  };

  // Filter homies based on search query
  const filteredHomies = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    
    const query = searchQuery.toLowerCase();
    return allHomies
      .filter((homie) => {
        const fullName = `${homie.first_name} ${homie.last_name}`.toLowerCase();
        return fullName.includes(query);
      })
      .slice(0, 10); // Limit to 10 results
  }, [searchQuery, allHomies]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showDropdown && !target.closest('.autocomplete-container')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const resetSearch = () => {
    setSearchQuery('');
    setShowDropdown(false);
    setAllHomies([]);
    setIsLoading(false);
  };

  return {
    allHomies,
    isLoading,
    searchQuery,
    setSearchQuery,
    showDropdown,
    setShowDropdown,
    filteredHomies,
    fetchHomies,
    resetSearch,
  };
}

