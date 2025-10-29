import { z } from 'zod';

/**
 * Zod schema for personal information step
 * Maps to: first_name, last_name, and social URLs
 */
export const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required').trim(),
  lastName: z.string().min(1, 'Last name is required').trim(),
  email: z.email('Invalid email address').optional().or(z.literal('')),
  github: z.url('Must be a valid URL').optional().or(z.literal('')),
  linkedin: z.url('Must be a valid URL').optional().or(z.literal('')),
  instagram: z.string().optional(), // Can be just handle or full URL
  xHandle: z.string().optional(), // X/Twitter handle
  website: z.url('Must be a valid URL').optional().or(z.literal('')),
});

/**
 * Zod schema for profile questions step
 * Maps to: why_billabong, working_on, how_to_help, where_from
 */
export const profileQuestionsSchema = z.object({
  childhoodDream: z.string().optional(),
  whereFrom: z.string().optional(),
  whyBillabong: z.string().min(1, 'Please tell us why you came to Billabong').trim(),
  workingOn: z.string().min(1, 'Please tell us what you\'re working on').trim(),
  howToHelp: z.string().optional(),
});

/**
 * Zod schema for rules acceptance
 */
export const rulesAcceptanceSchema = z.object({
  agreedToRules: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the house rules to continue',
  }),
});

/**
 * Complete homie insert schema
 * Combines all steps for database insertion
 */
export const homieInsertSchema = z.object({
  firstName: z.string().min(1, 'First name is required').trim(),
  lastName: z.string().min(1, 'Last name is required').trim(),
  email: z.email('Invalid email address').optional().or(z.literal('')),
  githubUrl: z.url('Must be a valid URL').optional().or(z.literal('')),
  linkedinUrl: z.url('Must be a valid URL').optional().or(z.literal('')),
  instagramUrl: z.string().optional(),
  xHandle: z.string().optional(),
  websiteUrl: z.url('Must be a valid URL').optional().or(z.literal('')),
  homieImageUrl: z.string().url().optional().or(z.literal('')),
  whereFrom: z.string().optional(),
  whyBillabong: z.string().optional(),
  workingOn: z.string().optional(),
  howToHelp: z.string().optional(),
  agreedToRules: z.boolean().default(true),
});

/**
 * Homie update schema (all fields optional)
 */
export const homieUpdateSchema = homieInsertSchema.partial();

/**
 * Search schema for finding returning guests
 */
export const returningGuestSearchSchema = z.object({
  searchName: z.string().min(2, 'Please enter at least 2 characters').trim(),
});

/**
 * Visit creation schema
 */
export const visitCreateSchema = z.object({
  homieId: z.uuid('Invalid homie ID'),
  purpose: z.string().optional(),
  notes: z.string().optional(),
});

/**
 * Helper to convert form data to database format
 */
export function mapFormDataToHomieInsert(data: {
  firstName: string;
  lastName: string;
  email?: string;
  github?: string;
  linkedin?: string;
  instagram?: string;
  xHandle?: string;
  website?: string;
  homieImageUrl?: string;
  whereFrom?: string;
  whyBillabong?: string;
  workingOn?: string;
  howToHelp?: string;
  agreedToRules?: boolean;
}) {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email || undefined,
    githubUrl: data.github || undefined,
    linkedinUrl: data.linkedin || undefined,
    instagramUrl: data.instagram || undefined,
    xHandle: data.xHandle || undefined,
    websiteUrl: data.website || undefined,
    homieImageUrl: data.homieImageUrl || undefined,
    whereFrom: data.whereFrom || undefined,
    whyBillabong: data.whyBillabong || undefined,
    workingOn: data.workingOn || undefined,
    howToHelp: data.howToHelp || undefined,
    agreedToRules: data.agreedToRules ?? true,
  };
}

// Export TypeScript types inferred from schemas
export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export type ProfileQuestions = z.infer<typeof profileQuestionsSchema>;
export type RulesAcceptance = z.infer<typeof rulesAcceptanceSchema>;
export type HomieInsert = z.infer<typeof homieInsertSchema>;
export type HomieUpdate = z.infer<typeof homieUpdateSchema>;
export type ReturningGuestSearch = z.infer<typeof returningGuestSearchSchema>;
export type VisitCreate = z.infer<typeof visitCreateSchema>;

