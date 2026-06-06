import { z } from 'zod';

export const MATCHER_SUBTITLE_GET_METHOD = 'GET' as const;
export const MATCHER_SUBTITLE_GET_ENDPOINT = '/ws/1.1/matcher.subtitle.get';

export type MatcherSubtitleGetQuery =
  | {
      track_isrc: string;
      q_track?: never;
      q_artist?: never;
      f_subtitle_length?: string;
      f_subtitle_length_max_deviation?: string;
    }
  | {
      track_isrc?: never;
      q_track: string;
      q_artist: string;
      f_subtitle_length?: string;
      f_subtitle_length_max_deviation?: string;
    };

export const mxmClientMatcherSubtitleGetResponseSchema = z.object({
  subtitle: z.object({
    subtitle_id: z.number(),
    subtitle_body: z.string(),
    lyrics_copyright: z.string(),
    region_restriction: z
      .object({
        allowed: z.array(z.string()),
        blocked: z.array(z.string()),
      })
      .optional(), // TODO: this is expected from the docs but is not present in the actual response
    subtitle_length: z.number(),
    subtitle_language: z.string(),
    subtitle_language_description: z.string(),
    script_tracking_url: z.string(),
    pixel_tracking_url: z.string(),
    updated_time: z.string(),
  }),
});

export type MxmClientMatcherSubtitleGetResponse = z.infer<
  typeof mxmClientMatcherSubtitleGetResponseSchema
>;
