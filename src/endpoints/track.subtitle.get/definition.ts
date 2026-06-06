import { z } from 'zod';
import type { ExtendedTrackIdentifierQuery } from '../shared.js';
import { subtitleSchema } from '../shared.js';

export const TRACK_SUBTITLE_GET_METHOD = 'GET' as const;
export const TRACK_SUBTITLE_GET_ENDPOINT = '/ws/1.1/track.subtitle.get';

export type TrackSubtitleGetQuery = ExtendedTrackIdentifierQuery & {
  subtitle_format?: string;
  f_subtitle_length?: string;
  f_subtitle_length_max_deviation?: string;
};

export const mxmClientTrackSubtitleGetResponseSchema = z.object({
  subtitle: subtitleSchema,
});

export type MxmClientTrackSubtitleGetResponse = z.infer<
  typeof mxmClientTrackSubtitleGetResponseSchema
>;
