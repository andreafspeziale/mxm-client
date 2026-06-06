import { z } from 'zod';
import { trackSchema } from '../shared.js';

export const MATCHER_TRACK_GET_METHOD = 'GET' as const;
export const MATCHER_TRACK_GET_ENDPOINT = '/ws/1.1/matcher.track.get';

export type MatcherTrackGetQuery =
  | { track_isrc: string; q_track?: never; q_artist?: never }
  | { track_isrc?: never; q_track: string; q_artist: string };

export const mxmClientMatcherTrackGetResponseSchema = z.object({
  track: trackSchema,
});

export type MxmClientMatcherTrackGetResponse = z.infer<
  typeof mxmClientMatcherTrackGetResponseSchema
>;
