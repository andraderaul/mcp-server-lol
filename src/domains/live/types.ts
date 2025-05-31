import { z } from 'zod';

// Base language schema
export const LanguageSchema = z
  .enum([
    'en-US',
    'es-ES',
    'fr-FR',
    'de-DE',
    'it-IT',
    'pt-BR',
    'ru-RU',
    'tr-TR',
    'ja-JP',
    'ko-KR',
    'zh-CN',
    'zh-TW',
  ])
  .describe('Language code for the API response');

// Tool input schemas
export const GetScheduleInputSchema = z.object({
  language: LanguageSchema.default('en-US').describe('Language code for the schedule response'),
  leagueId: z.string().optional().describe('League ID to filter the schedule by'),
});

export const GetLiveMatchesInputSchema = z.object({
  language: LanguageSchema.default('en-US').describe('Language code for the live matches response'),
});

export const GetLeaguesInputSchema = z.object({
  language: LanguageSchema.default('en-US').describe('Language code for the leagues response'),
  region: z
    .string()
    .optional()
    .describe('Filter leagues by specific region (e.g., "AMERICAS", "EMEA", "ASIA")'),
});

export const GetEventDetailsInputSchema = z.object({
  eventId: z
    .string()
    .min(1, 'Event ID cannot be empty')
    .describe('Unique identifier of the esports event'),
  language: LanguageSchema.default('en-US').describe(
    'Language code for the event details response'
  ),
});

export const GetMatchVODsInputSchema = z.object({
  eventId: z
    .string()
    .min(1, 'Event ID cannot be empty')
    .describe('Unique identifier of the esports event to get VODs for'),
  language: LanguageSchema.default('en-US').describe('Language code for the VODs response'),
});

export const GetUpcomingMatchesInputSchema = z.object({
  language: LanguageSchema.default('en-US').describe(
    'Language code for the upcoming matches response'
  ),
  limit: z
    .number()
    .min(1, 'Limit must be at least 1')
    .max(50, 'Limit cannot exceed 50 matches')
    .default(10)
    .describe('Maximum number of upcoming matches to return'),
});

// Inferred TypeScript types
export type Language = z.infer<typeof LanguageSchema>;
export type GetScheduleInput = z.infer<typeof GetScheduleInputSchema>;
export type GetLiveMatchesInput = z.infer<typeof GetLiveMatchesInputSchema>;
export type GetLeaguesInput = z.infer<typeof GetLeaguesInputSchema>;
export type GetEventDetailsInput = z.infer<typeof GetEventDetailsInputSchema>;
export type GetMatchVODsInput = z.infer<typeof GetMatchVODsInputSchema>;
export type GetUpcomingMatchesInput = z.infer<typeof GetUpcomingMatchesInputSchema>;
