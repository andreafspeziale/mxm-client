import { z } from 'zod';
import { lyricsSchema } from '../shared.js';

export const MATCHER_LYRICS_GET_METHOD = 'GET' as const;
export const MATCHER_LYRICS_GET_ENDPOINT = '/ws/1.1/matcher.lyrics.get';

export type MatcherLyricsGetQuery =
  | { track_isrc: string; q_track?: never; q_artist?: never }
  | { track_isrc?: never; q_track: string; q_artist: string };

export const mxmClientMatcherLyricsGetResponseSchema = z.object({
  lyrics: lyricsSchema,
});

export type MxmClientMatcherLyricsGetResponse = z.infer<
  typeof mxmClientMatcherLyricsGetResponseSchema
>;
