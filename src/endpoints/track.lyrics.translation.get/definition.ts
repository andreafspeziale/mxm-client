import { z } from 'zod';
import type { ExtendedTrackIdentifierQuery } from '../shared.js';

export const TRACK_LYRICS_TRANSLATION_GET_METHOD = 'GET' as const;
export const TRACK_LYRICS_TRANSLATION_GET_ENDPOINT =
  '/ws/1.1/track.lyrics.translation.get';

export type TrackLyricsTranslationGetQuery = ExtendedTrackIdentifierQuery & {
  selected_language: string;
  min_completed?: string;
};

export const lyricsTranslatedSchema = z.object({
  lyrics_body: z.string(),
  script_tracking_url: z.string(),
  pixel_tracking_url: z.string(),
  html_tracking_url: z.string(),
  selected_language: z.string(),
  restricted: z.number(),
});

export type LyricsTranslated = z.infer<typeof lyricsTranslatedSchema>;

export function isLyricsTranslated(value: unknown): value is LyricsTranslated {
  return lyricsTranslatedSchema.safeParse(value).success;
}

export const mxmClientTrackLyricsTranslationGetResponseSchema = z.object({
  lyrics: z.object({
    lyrics_id: z.number(),
    explicit: z.number(),
    lyrics_body: z.string(),
    lyrics_language: z.string(),
    script_tracking_url: z.string(),
    pixel_tracking_url: z.string(),
    lyrics_copyright: z.string(),
    updated_time: z.string(),
    region_restriction: z.object({
      allowed: z.array(z.string()),
      blocked: z.array(z.string()),
    }),
    lyrics_translated: z.union([lyricsTranslatedSchema, z.object({}).strict()]),
  }),
});

export type MxmClientTrackLyricsTranslationGetResponse = z.infer<
  typeof mxmClientTrackLyricsTranslationGetResponseSchema
>;
