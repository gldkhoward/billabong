'use client';

import { useState, useTransition } from 'react';
import { createHomie, updateHomie, findHomieByName, getHomieById } from '@/actions/homie-actions';
import type { HomieInsert, HomieUpdate } from '@/schemas/homie-schema';

type HomieRow = {
  id: string;
  first_name: string;
  last_name: string;
  // email intentionally excluded - never exposed to client for security
  github_url: string | null;
  linkedin_url: string | null;
  instagram_url: string | null;
  x_handle: string | null;
  website_url: string | null;
  where_from: string | null;
  why_billabong: string | null;
  working_on: string | null;
  how_to_help: string | null;
  agreed_to_rules: boolean;
  created_at: string;
  updated_at: string;
};

/**
 * Hook for creating a new homie
 */
export function useCreateHomie() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<HomieRow | null>(null);

  const create = async (formData: HomieInsert) => {
    setError(null);
    setData(null);

    startTransition(async () => {
      try {
        const result = await createHomie(formData);
        
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    });
  };

  return {
    create,
    isPending,
    error,
    data,
    reset: () => {
      setError(null);
      setData(null);
    },
  };
}

/**
 * Hook for updating an existing homie
 */
export function useUpdateHomie() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<HomieRow | null>(null);

  const update = async (id: string, formData: HomieUpdate) => {
    setError(null);
    setData(null);

    startTransition(async () => {
      try {
        const result = await updateHomie(id, formData);
        
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    });
  };

  return {
    update,
    isPending,
    error,
    data,
    reset: () => {
      setError(null);
      setData(null);
    },
  };
}

/**
 * Hook for searching homies by name
 */
export function useFindHomie() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<HomieRow[] | null>(null);

  const search = async (searchTerm: string) => {
    setError(null);
    setData(null);

    startTransition(async () => {
      try {
        const result = await findHomieByName(searchTerm);
        
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    });
  };

  return {
    search,
    isPending,
    error,
    data,
    reset: () => {
      setError(null);
      setData(null);
    },
  };
}

/**
 * Hook for getting a single homie by ID
 */
export function useHomieById() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<HomieRow | null>(null);

  const fetch = async (id: string) => {
    setError(null);
    setData(null);

    startTransition(async () => {
      try {
        const result = await getHomieById(id);
        
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    });
  };

  return {
    fetch,
    isPending,
    error,
    data,
    reset: () => {
      setError(null);
      setData(null);
    },
  };
}

