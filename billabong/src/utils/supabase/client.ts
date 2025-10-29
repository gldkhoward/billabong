'use client';

import { createBrowserClient } from '@supabase/ssr';

import type { Database } from '@/types/database.types';

import type { ProjectSupabaseClient } from '@/types/index';

export const createClient = (): ProjectSupabaseClient => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};
