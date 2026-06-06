import { z } from 'zod';

export const TRACK_SUBTITLE_GET_METHOD = 'GET' as const;
export const TRACK_SUBTITLE_GET_ENDPOINT = '/ws/1.1/track.subtitle.get';

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

export const mxmClientTrackSubtitleGetResponseSchema = z.object({
  subtitle: z.object({
    lyrics_copyright: z.string(),
    pixel_tracking_url: z.string(),
    script_tracking_url: z.string(),
    subtitle_body: z.string(),
    subtitle_id: z.number(),
    subtitle_language: z.string(),
    subtitle_language_description: z.string(),
    subtitle_length: z.number(),
    updated_time: z.string(),
  }),
});

export type MxmClientTrackSubtitleGetResponse = z.infer<
  typeof mxmClientTrackSubtitleGetResponseSchema
>;
