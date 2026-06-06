import { z } from 'zod';
import type { TrackIdentifierQuery } from '../shared.js';
import { lyricsSchema } from '../shared.js';

export const TRACK_LYRICS_GET_METHOD = 'GET' as const;
export const TRACK_LYRICS_GET_ENDPOINT = '/ws/1.1/track.lyrics.get';

export type TrackLyricsGetQuery = TrackIdentifierQuery;

export const mxmClientTrackLyricsGetResponseSchema = z.object({
  lyrics: lyricsSchema,
});

export type MxmClientTrackLyricsGetResponse = z.infer<
  typeof mxmClientTrackLyricsGetResponseSchema
>;
