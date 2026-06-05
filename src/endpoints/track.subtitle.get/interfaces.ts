import type { z } from 'zod';
import type { mxmClientTrackSubtitleGetResponseSchema } from './schema.js';

export type TrackSubtitleGetQuery =
  | {
      commontrack_id: string;
      track_id?: never;
      track_isrc?: never;
      track_spotify_id?: never;
      track_itunes_id?: never;
      subtitle_format?: string;
      f_subtitle_length?: string;
      f_subtitle_length_max_deviation?: string;
    }
  | {
      commontrack_id?: never;
      track_id: string;
      track_isrc?: never;
      track_spotify_id?: never;
      track_itunes_id?: never;
      subtitle_format?: string;
      f_subtitle_length?: string;
      f_subtitle_length_max_deviation?: string;
    }
  | {
      commontrack_id?: never;
      track_id?: never;
      track_isrc: string;
      track_spotify_id?: never;
      track_itunes_id?: never;
      subtitle_format?: string;
      f_subtitle_length?: string;
      f_subtitle_length_max_deviation?: string;
    }
  | {
      commontrack_id?: never;
      track_id?: never;
      track_isrc?: never;
      track_spotify_id: string;
      track_itunes_id?: never;
      subtitle_format?: string;
      f_subtitle_length?: string;
      f_subtitle_length_max_deviation?: string;
    }
  | {
      commontrack_id?: never;
      track_id?: never;
      track_isrc?: never;
      track_spotify_id?: never;
      track_itunes_id: string;
      subtitle_format?: string;
      f_subtitle_length?: string;
      f_subtitle_length_max_deviation?: string;
    };

export type MxmClientTrackSubtitleGetResponse = z.infer<
  typeof mxmClientTrackSubtitleGetResponseSchema
>;
