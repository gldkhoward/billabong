import { cookies } from 'next/headers';
import type { ProjectSupabaseClient } from '@/shared/utils/supabase/types';
import { createServerClient } from '@supabase/ssr';

export async function createClient(): Promise<ProjectSupabaseClient> {
  const cookieStore = await cookies();

  const serverClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          return cookieStore.getAll();
        },
        async setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  ); // as unknown as ProjectSupabaseClient;

  //Return the server client as a promise
  return serverClient;
}
