import { createLogger } from '@/shared/lib/logger'; // Assuming this is the correct path
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/types/database/supabase/database';

// Create a logger instance specific to this utility
const serviceLogger = createLogger({
  prefix: '[UTIL: SupabaseServiceRoleClient]',
});

/**
 * This function creates a Supabase client with the service role key.
 * WARNING: This client should only be used on the server-side and never exposed
 * to the client. It is intended for specific cases where you need to bypass
 * Row Level Security, such as the initial user lookup in an auth flow.
 */
export const createServiceRoleClient = async (): Promise<SupabaseClient<Database>> => {
  serviceLogger.debug('Attempting to create Supabase service role client...');

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_KEY;

    if (!supabaseUrl || !serviceKey) {
      serviceLogger.error('Supabase URL or Service Role Key is not defined in environment variables.');
      throw new Error('Server configuration error: Missing Supabase credentials.');
    }

    const client = createClient<Database>(supabaseUrl, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    serviceLogger.debug('Supabase service role client created successfully.');
    return client;
  } catch (error: unknown) {
    serviceLogger.error('Failed to create Supabase service role client.', error);
    // Re-throw the error to ensure the calling function knows about the failure.
    throw error;
  }
};
