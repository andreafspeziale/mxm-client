import { z } from 'zod';

export const TRACK_LYRICS_GET_METHOD = 'GET' as const;
export const TRACK_LYRICS_GET_ENDPOINT = '/ws/1.1/track.lyrics.get';

export type TrackLyricsGetQuery =
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

export const mxmClientTrackLyricsGetResponseSchema = z.object({
  lyrics: z.object({
    explicit: z.number(),
    lyrics_body: z.string(),
    lyrics_copyright: z.string(),
    lyrics_id: z.number(),
    lyrics_language: z.string(),
    pixel_tracking_url: z.string(),
    region_restriction: z
      .object({
        allowed: z.array(z.string()),
        blocked: z.array(z.string()),
      })
      .optional(), // TODO: this is expected from the docs but is not present in the actual response
    script_tracking_url: z.string(),
    updated_time: z.string(),
  }),
});

export type MxmClientTrackLyricsGetResponse = z.infer<
  typeof mxmClientTrackLyricsGetResponseSchema
>;
