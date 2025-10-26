import type { SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/types/database/supabase/database';

export type ProjectSupabaseClient = SupabaseClient<Database>;
