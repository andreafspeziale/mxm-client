import { z } from 'zod';
import { trackSchema } from '../shared.js';

export const TRACK_LYRICS_FINGERPRINT_POST_METHOD = 'POST' as const;
export const TRACK_LYRICS_FINGERPRINT_POST_ENDPOINT =
  '/ws/1.1/track.lyrics.fingerprint.post';

export interface TrackLyricsFingerprintPostQuery {
  size?: number;
  limit?: number;
}

export interface TrackLyricsFingerprintPostBody {
  text: string;
}

export const mxmClientTrackLyricsFingerprintPostResponseSchema = z.object({
  track_list: z.array(
    z.object({
      similarity: z.number(),
      track: trackSchema,
    }),
  ),
});

export type MxmClientTrackLyricsFingerprintPostResponse = z.infer<
  typeof mxmClientTrackLyricsFingerprintPostResponseSchema
>;
