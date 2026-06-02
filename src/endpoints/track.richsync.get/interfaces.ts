import type { z } from 'zod';
import type { mxmClientTrackRichSyncGetResponse } from './schema.js';

export type TrackRichSyncGetQuery =
  | {
      commontrack_id: string;
      track_id?: never;
      track_isrc?: never;
      track_spotify_id?: never;
      track_itunes_id?: never;
      f_richsync_length?: string;
      f_richsync_length_max_deviation?: string;
    }
  | {
      commontrack_id?: never;
      track_id: string;
      track_isrc?: never;
      track_spotify_id?: never;
      track_itunes_id?: never;
      f_richsync_length?: string;
      f_richsync_length_max_deviation?: string;
    }
  | {
      commontrack_id?: never;
      track_id?: never;
      track_isrc: string;
      track_spotify_id?: never;
      track_itunes_id?: never;
      f_richsync_length?: string;
      f_richsync_length_max_deviation?: string;
    }
  | {
      commontrack_id?: never;
      track_id?: never;
      track_isrc?: never;
      track_spotify_id: string;
      track_itunes_id?: never;
      f_richsync_length?: string;
      f_richsync_length_max_deviation?: string;
    }
  | {
      commontrack_id?: never;
      track_id?: never;
      track_isrc?: never;
      track_spotify_id?: never;
      track_itunes_id: string;
      f_richsync_length?: string;
      f_richsync_length_max_deviation?: string;
    };

export type MxmClientTrackRichSyncGetResponse = z.infer<
  typeof mxmClientTrackRichSyncGetResponse
>;
