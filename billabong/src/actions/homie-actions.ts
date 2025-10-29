'use server';

import { createServiceRoleClient } from '@/utils/supabase/service';
import { homieInsertSchema, homieUpdateSchema, returningGuestSearchSchema } from '@/schemas/homie-schema';
import type { TablesInsert, TablesUpdate } from '@/types/database.types';

// Server-only type with email (used internally)
type HomieRowInternal = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
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

// Public type without email (returned to client)
type HomieRow = Omit<HomieRowInternal, 'email'>;

type ActionResult<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

/**
 * Helper function to strip email from homie data before sending to client
 * This ensures emails are never exposed to the client-side code
 */
function stripEmail(homie: HomieRowInternal): HomieRow {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { email, ...homieWithoutEmail } = homie;
  return homieWithoutEmail;
}

/**
 * Create a new homie in the database
 */
export async function createHomie(formData: unknown): Promise<ActionResult<HomieRow>> {
  try {
    // Validate input with Zod
    const validated = homieInsertSchema.parse(formData);
    
    const supabase = await createServiceRoleClient();
    
    // Map to database column names
    const insertData: TablesInsert<'homies'> = {
      first_name: validated.firstName,
      last_name: validated.lastName,
      email: validated.email || null,
      github_url: validated.githubUrl || null,
      linkedin_url: validated.linkedinUrl || null,
      instagram_url: validated.instagramUrl || null,
      x_handle: validated.xHandle || null,
      website_url: validated.websiteUrl || null,
      where_from: validated.whereFrom || null,
      why_billabong: validated.whyBillabong || null,
      working_on: validated.workingOn || null,
      how_to_help: validated.howToHelp || null,
      agreed_to_rules: validated.agreedToRules,
    };
    
    const { data, error } = await supabase
      .from('homies')
      .insert(insertData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating homie:', error);
      return { success: false, error: error.message };
    }
    
    // Strip email before sending to client
    return { success: true, data: stripEmail(data) };
  } catch (error) {
    console.error('Error in createHomie:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

/**
 * Update an existing homie
 */
export async function updateHomie(
  id: string, 
  formData: unknown
): Promise<ActionResult<HomieRow>> {
  try {
    // Validate input with Zod
    const validated = homieUpdateSchema.parse(formData);
    
    const supabase = await createServiceRoleClient();
    
    // Map to database column names (only include defined fields)
    const updateData: TablesUpdate<'homies'> = {};
    
    if (validated.firstName !== undefined) updateData.first_name = validated.firstName;
    if (validated.lastName !== undefined) updateData.last_name = validated.lastName;
    if (validated.email !== undefined) updateData.email = validated.email || null;
    if (validated.githubUrl !== undefined) updateData.github_url = validated.githubUrl || null;
    if (validated.linkedinUrl !== undefined) updateData.linkedin_url = validated.linkedinUrl || null;
    if (validated.instagramUrl !== undefined) updateData.instagram_url = validated.instagramUrl || null;
    if (validated.xHandle !== undefined) updateData.x_handle = validated.xHandle || null;
    if (validated.websiteUrl !== undefined) updateData.website_url = validated.websiteUrl || null;
    if (validated.whereFrom !== undefined) updateData.where_from = validated.whereFrom || null;
    if (validated.whyBillabong !== undefined) updateData.why_billabong = validated.whyBillabong || null;
    if (validated.workingOn !== undefined) updateData.working_on = validated.workingOn || null;
    if (validated.howToHelp !== undefined) updateData.how_to_help = validated.howToHelp || null;
    if (validated.agreedToRules !== undefined) updateData.agreed_to_rules = validated.agreedToRules;
    
    const { data, error } = await supabase
      .from('homies')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating homie:', error);
      return { success: false, error: error.message };
    }
    
    // Strip email before sending to client
    return { success: true, data: stripEmail(data) };
  } catch (error) {
    console.error('Error in updateHomie:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

/**
 * Find a homie by name (case-insensitive search)
 */
export async function findHomieByName(searchTerm: unknown): Promise<ActionResult<HomieRow[]>> {
  try {
    // Validate input
    const validated = returningGuestSearchSchema.parse({ searchName: searchTerm });
    
    const supabase = await createServiceRoleClient();
    
    // Search in both first and last name
    const { data, error } = await supabase
      .from('homies')
      .select('*')
      .or(`first_name.ilike.%${validated.searchName}%,last_name.ilike.%${validated.searchName}%`)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) {
      console.error('Error searching for homie:', error);
      return { success: false, error: error.message };
    }
    
    // Strip emails from all results before sending to client
    const safeData = (data || []).map(stripEmail);
    return { success: true, data: safeData };
  } catch (error) {
    console.error('Error in findHomieByName:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

/**
 * Get a single homie by ID
 */
export async function getHomieById(id: string): Promise<ActionResult<HomieRow>> {
  try {
    const supabase = await createServiceRoleClient();
    
    const { data, error } = await supabase
      .from('homies')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching homie:', error);
      return { success: false, error: error.message };
    }
    
    // Strip email before sending to client
    return { success: true, data: stripEmail(data) };
  } catch (error) {
    console.error('Error in getHomieById:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

/**
 * Get all homies with optional search
 */
export async function getAllHomies(searchQuery?: string): Promise<ActionResult<HomieRow[]>> {
  try {
    const supabase = await createServiceRoleClient();
    
    let query = supabase
      .from('homies')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (searchQuery && searchQuery.trim()) {
      query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%`);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching homies:', error);
      return { success: false, error: error.message };
    }
    
    // Strip emails from all results before sending to client
    const safeData = (data || []).map(stripEmail);
    return { success: true, data: safeData };
  } catch (error) {
    console.error('Error in getAllHomies:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'An unknown error occurred' };
  }
}

