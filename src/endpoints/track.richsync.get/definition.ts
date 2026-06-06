import { z } from 'zod';

export const TRACK_RICHSYNC_GET_METHOD = 'GET' as const;
export const TRACK_RICH_SYNC_GET_ENDPOINT = '/ws/1.1/track.richsync.get';

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

export const mxmClientTrackRichSyncGetResponseSchema = z.object({
  richsync: z.object({
    richsync_id: z.number(),
    restricted: z.number(),
    richsync_body: z.string(),
    lyrics_copyright: z.string(),
    richsync_length: z.number(),
    richssync_language: z.string(),
    richsync_language_description: z.string(),
    richsync_avg_count: z.number(),
    script_tracking_url: z.string(),
    pixel_tracking_url: z.string(),
    html_tracking_url: z.string(),
    writer_list: z.array(z.unknown()),
    publisher_list: z.array(z.unknown()),
    updated_time: z.string(),
  }),
});

export type MxmClientTrackRichSyncGetResponse = z.infer<
  typeof mxmClientTrackRichSyncGetResponseSchema
>;
