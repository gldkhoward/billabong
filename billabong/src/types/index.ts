import type { Database } from "./database.types";
import type { SupabaseClient } from "@supabase/supabase-js";

export type ProjectSupabaseClient = SupabaseClient<Database>;

export type HomieRow = Database['public']['Tables']['homies']['Row'];
export type HomieInsert = Database['public']['Tables']['homies']['Insert'];
export type HomieUpdate = Database['public']['Tables']['homies']['Update'];

export type VisitRow = Database['public']['Tables']['visits']['Row'];
export type VisitInsert = Database['public']['Tables']['visits']['Insert'];
export type VisitUpdate = Database['public']['Tables']['visits']['Update'];

export type InterestRow = Database['public']['Tables']['interests']['Row'];
export type InterestInsert = Database['public']['Tables']['interests']['Insert'];
export type InterestUpdate = Database['public']['Tables']['interests']['Update'];

export type HomieFullyJoined = HomieRow & {
    interests: InterestRow[];
    visits: VisitRow[];
};