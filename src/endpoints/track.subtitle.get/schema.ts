import { z } from 'zod';

export const mxmClientTrackSubtitleGetResponseSchema = z.object({
  subtitle: z.object({
    lyrics_copyright: z.string(),
    pixel_tracking_url: z.string(),
    script_tracking_url: z.string(),
    subtitle_body: z.string(),
    subtitle_id: z.number(),
    subtitle_language: z.string(),
    subtitle_language_description: z.string(),
    subtitle_length: z.number(),
    updated_time: z.string(),
  }),
});
