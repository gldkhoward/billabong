'use server';

import { createServiceRoleClient } from '@/utils/supabase/service';
import { visitCreateSchema } from '@/schemas/homie-schema';
import type { TablesInsert } from '@/types/database.types';

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
    // email intentionally excluded for security - never expose to client
  };
};

type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Create a new visit (check-in)
 */
export async function createVisit(formData: unknown): Promise<ActionResult<VisitRow>> {
  try {
    // Validate input with Zod
    const validated = visitCreateSchema.parse(formData);
    
    const supabase = await createServiceRoleClient();
    
    // Map to database column names
    const insertData: TablesInsert<'visits'> = {
      homie_id: validated.homieId,
      purpose: validated.purpose || null,
      notes: validated.notes || null,
      agreed_rules_at: new Date().toISOString(),
      source: 'web',
      checkin_at: new Date().toISOString(),
    };
    
    const { data, error } = await supabase
      .from('visits')
      .insert(insertData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating visit:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error in createVisit:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

/**
 * Check out a visit
 */
export async function checkoutVisit(visitId: string): Promise<ActionResult<VisitRow>> {
  try {
    const supabase = await createServiceRoleClient();
    
    const { data, error } = await supabase
      .from('visits')
      .update({ checkout_at: new Date().toISOString() })
      .eq('id', visitId)
      .select()
      .single();
    
    if (error) {
      console.error('Error checking out visit:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error in checkoutVisit:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

/**
 * Get all active visits (not checked out)
 */
export async function getActiveVisits(): Promise<ActionResult<VisitWithHomie[]>> {
  try {
    const supabase = await createServiceRoleClient();
    
    const { data, error } = await supabase
      .from('visits')
      .select(`
        *,
        homie:homies (
          id,
          first_name,
          last_name
        )
      `)
      .is('checkout_at', null)
      .order('checkin_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching active visits:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data: data as unknown as VisitWithHomie[] };
  } catch (error) {
    console.error('Error in getActiveVisits:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

/**
 * Get visit history for a specific homie
 */
export async function getHomieVisitHistory(homieId: string): Promise<ActionResult<{
  visits: VisitRow[];
  totalVisits: number;
  lastVisit: string | null;
}>> {
  try {
    const supabase = await createServiceRoleClient();
    
    const { data, error } = await supabase
      .from('visits')
      .select('*')
      .eq('homie_id', homieId)
      .order('checkin_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching visit history:', error);
      return { success: false, error: error.message };
    }
    
    const visits = data || [];
    const totalVisits = visits.length;
    const lastVisit = visits.length > 0 ? visits[0].checkin_at : null;
    
    return { 
      success: true, 
      data: { visits, totalVisits, lastVisit } 
    };
  } catch (error) {
    console.error('Error in getHomieVisitHistory:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

/**
 * Get the current active visit for a homie (if any)
 */
export async function getCurrentVisit(homieId: string): Promise<ActionResult<VisitRow | null>> {
  try {
    const supabase = await createServiceRoleClient();
    
    const { data, error } = await supabase
      .from('visits')
      .select('*')
      .eq('homie_id', homieId)
      .is('checkout_at', null)
      .order('checkin_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching current visit:', error);
      return { success: false, error: error.message };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Error in getCurrentVisit:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

