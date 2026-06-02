import type { z } from 'zod';
import type { mxmClientMatcherTrackGetResponseSchema } from './schema.js';

export type MatcherTrackGetQuery =
  | { track_isrc: string; q_track?: never; q_artist?: never }
  | { track_isrc?: never; q_track: string; q_artist: string };

export type MxmClientMatcherTrackGetResponse = z.infer<
  typeof mxmClientMatcherTrackGetResponseSchema
>;
