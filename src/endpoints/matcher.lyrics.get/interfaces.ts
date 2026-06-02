import type { z } from 'zod';
import type { mxmClientMatcherLyricsGetResponseSchema } from './schema.js';

export type MatcherLyricsGetQuery =
  | { track_isrc: string; q_track?: never; q_artist?: never }
  | { track_isrc?: never; q_track: string; q_artist: string };

export type MxmClientMatcherLyricsGetResponse = z.infer<
  typeof mxmClientMatcherLyricsGetResponseSchema
>;
