import { z } from 'zod';
import type { ExtendedTrackIdentifierQuery } from '../shared.js';

export const TRACK_SUBTITLE_TRANSLATION_GET_METHOD = 'GET' as const;
export const TRACK_SUBTITLE_TRANSLATION_GET_ENDPOINT =
  '/ws/1.1/track.subtitle.translation.get';

export type TrackSubtitleTranslationGetQuery = ExtendedTrackIdentifierQuery & {
  selected_language: string;
  min_completed?: string;
  f_subtitle_length?: string;
  f_subtitle_length_max_deviation?: string;
};

export const subtitleTranslatedSchema = z.object({
  restricted: z.number(),
  subtitle_body: z.string(),
  selected_language: z.string(),
  script_tracking_url: z.string(),
  pixel_tracking_url: z.string(),
  html_tracking_url: z.string(),
});

export type SubtitleTranslated = z.infer<typeof subtitleTranslatedSchema>;

export function isSubtitleTranslated(
  value: unknown,
): value is SubtitleTranslated {
  return subtitleTranslatedSchema.safeParse(value).success;
}

export const mxmClientTrackSubtitleTranslationGetResponseSchema = z.object({
  subtitle: z.object({
    subtitle_id: z.number(),
    subtitle_body: z.string(),
    lyrics_copyright: z.string(),
    subtitle_length: z.number(),
    subtitle_language: z.string(),
    subtitle_language_description: z.string(),
    script_tracking_url: z.string(),
    pixel_tracking_url: z.string(),
    updated_time: z.string(),
    region_restriction: z.object({
      allowed: z.array(z.string()),
      blocked: z.array(z.string()),
    }),
    subtitle_translated: z.union([
      subtitleTranslatedSchema,
      z.object({}).strict(),
    ]),
  }),
});

export type MxmClientTrackSubtitleTranslationGetResponse = z.infer<
  typeof mxmClientTrackSubtitleTranslationGetResponseSchema
>;
