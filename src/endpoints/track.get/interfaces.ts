import type { z } from 'zod';
import type { mxmClientTrackGetResponseSchema } from './schema.js';

export type TrackGetQuery =
  | {
      commontrack_id: string;
      track_isrc?: never;
      track_spotify_id?: never;
      track_itunes_id?: never;
    }
  | {
      commontrack_id?: never;
      track_isrc: string;
      track_spotify_id?: never;
      track_itunes_id?: never;
    }
  | {
      commontrack_id?: never;
      track_isrc?: never;
      track_spotify_id: string;
      track_itunes_id?: never;
    }
  | {
      commontrack_id?: never;
      track_isrc?: never;
      track_spotify_id?: never;
      track_itunes_id: string;
    };

export type MxmClientTrackGetResponse = z.infer<
  typeof mxmClientTrackGetResponseSchema
>;
