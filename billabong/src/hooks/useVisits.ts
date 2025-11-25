'use client';

import { useState, useTransition } from 'react';
import { 
  createVisit, 
  checkoutVisit, 
  getActiveVisits,
  getHomieVisitHistory,
  getCurrentVisit,
} from '@/actions/visit-actions';
import type { VisitCreate } from '@/schemas/homie-schema';

type VisitRow = {
  id: string;
  homie_id: string;
  checkin_at: string;
  checkout_at: string | null;
  purpose: string | null;
  notes: string | null;
  agreed_rules_at: string | null;
  source: string | null;
  created_at: string;
};

type VisitWithHomie = VisitRow & {
  homie: {
    id: string;
    first_name: string;
    last_name: string;
    email: string | null;
  };
};

type VisitHistory = {
  visits: VisitRow[];
  totalVisits: number;
  lastVisit: string | null;
};

/**
 * Hook for creating a new visit (check-in)
 */
export function useCreateVisit() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<VisitRow | null>(null);

  const create = async (formData: VisitCreate) => {
    setError(null);
    setData(null);

    startTransition(async () => {
      try {
        const result = await createVisit(formData);
        
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
 * Hook for checking out a visit
 */
export function useCheckout() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<VisitRow | null>(null);

  const checkout = async (visitId: string) => {
    setError(null);
    setData(null);

    startTransition(async () => {
      try {
        const result = await checkoutVisit(visitId);
        
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
    checkout,
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
 * Hook for fetching active visits
 */
export function useActiveVisits() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<VisitWithHomie[] | null>(null);

  const fetch = async () => {
    setError(null);
    setData(null);

    startTransition(async () => {
      try {
        const result = await getActiveVisits();
        
        if (result.success) {
          setData(result.data as VisitWithHomie[]);
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

/**
 * Hook for fetching visit history for a homie
 */
export function useVisitHistory() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<VisitHistory | null>(null);

  const fetch = async (homieId: string) => {
    setError(null);
    setData(null);

    startTransition(async () => {
      try {
        const result = await getHomieVisitHistory(homieId);
        
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

/**
 * Hook for getting current active visit for a homie
 */
export function useCurrentVisit() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<VisitRow | null>(null);

  const fetch = async (homieId: string) => {
    setError(null);
    setData(null);

    startTransition(async () => {
      try {
        const result = await getCurrentVisit(homieId);
        
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



