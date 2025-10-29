import { createClient } from '@supabase/supabase-js';

import type { Database } from '@/types/database.types';
import type { ProjectSupabaseClient } from '@/types/index';


/**
 * This function creates a Supabase client with the service role key.
 * WARNING: This client should only be used on the server-side and never exposed
 * to the client. It is intended for specific cases where you need to bypass
 * Row Level Security, such as the initial user lookup in an auth flow.
 */
export const createServiceRoleClient = async (): Promise<ProjectSupabaseClient> => {

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_KEY!;

    if (!supabaseUrl || !serviceKey) {
      throw new Error('Server configuration error: Missing Supabase credentials.');
    }

    const client = createClient<Database>(supabaseUrl, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    return client;
  } catch (error: unknown) {
    // Re-throw the error to ensure the calling function knows about the failure.
    throw error;
  }
};
