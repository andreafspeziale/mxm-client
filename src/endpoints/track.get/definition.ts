import { z } from 'zod';
import type { TrackIdentifierQuery } from '../shared.js';
import { trackSchema } from '../shared.js';

export const TRACK_GET_METHOD = 'GET' as const;
export const TRACK_GET_ENDPOINT = '/ws/1.1/track.get';

export type TrackGetQuery = TrackIdentifierQuery;

export const mxmClientTrackGetResponseSchema = z.object({
  track: trackSchema,
});

export type MxmClientTrackGetResponse = z.infer<
  typeof mxmClientTrackGetResponseSchema
>;
