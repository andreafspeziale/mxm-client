import { z } from 'zod';

export const TRACK_SEARCH_METHOD = 'GET' as const;
export const TRACK_SEARCH_ENDPOINT = '/ws/1.1/track.search';

// TODO: improve this type definition with some sort of utility
type QueryParams =
  | {
      q_track: string;
      q_artist?: string;
      q_lyrics?: string;
      q_track_artist?: string;
      q_writer?: string;
      q?: string;
    }
  | {
      q_track?: string;
      q_artist: string;
      q_lyrics?: string;
      q_track_artist?: string;
      q_writer?: string;
      q?: string;
    }
  | {
      q_track?: string;
      q_artist?: string;
      q_lyrics: string;
      q_track_artist?: string;
      q_writer?: string;
      q?: string;
    }
  | {
      q_track?: string;
      q_artist?: string;
      q_lyrics?: string;
      q_track_artist: string;
      q_writer?: string;
      q?: string;
    }
  | {
      q_track?: string;
      q_artist?: string;
      q_lyrics?: string;
      q_track_artist?: string;
      q_writer: string;
      q?: string;
    }
  | {
      q_track?: string;
      q_artist?: string;
      q_lyrics?: string;
      q_track_artist?: string;
      q_writer?: string;
      q: string;
    };

interface OptionalFilters {
  f_artist_id?: string;
  f_music_genre_id?: string;
  f_lyrics_language?: string;
  f_has_lyrics?: string;
  f_track_release_group_first_release_date_min?: string;
  f_track_release_group_first_release_date_max?: string;
  s_artist_rating?: string;
  s_track_rating?: string;
  page?: string;
  page_size?: string;
}

export type TrackSearchQuery = QueryParams & OptionalFilters;

export const mxmClientTrackSearchResponseSchema = z.object({
  track_list: z.array(
    z.object({
      track: z.object({
        track_id: z.number(),
        track_isrc: z.string(),
        commontrack_isrcs: z.array(z.array(z.string())),
        track_spotify_id: z.string(),
        track_name: z.string(),
        track_rating: z.number(),
        track_length: z.number(),
        commontrack_id: z.number(),
        instrumental: z.number(),
        explicit: z.number(),
        has_lyrics: z.number(),
        track_lyrics_translation_status: z
          .array(
            z.object({
              from: z.string(),
              perc: z.number(),
              to: z.string(),
            }),
          )
          .optional(), // TODO: this is expected from the docs but is not present in the actual response
        has_subtitles: z.number(),
        has_richsync: z.number(),
        num_favourite: z.number(),
        album_id: z.number(),
        album_name: z.string(),
        artist_id: z.number(),
        artist_name: z.string(),
        // TODO: the following are not present in the docs but actually are in the response
        album_coverart_100x100: z.string(),
        album_coverart_350x350: z.string(),
        album_coverart_500x500: z.string(),
        album_coverart_800x800: z.string(),
        //
        track_share_url: z.string(),
        track_edit_url: z.string(),
        restricted: z.number(),
        updated_time: z.string(),
        primary_genres: z.object({
          music_genre_list: z.array(
            z.object({
              music_genre: z.object({
                music_genre_id: z.number(),
                music_genre_name: z.string(),
                music_genre_name_extended: z.string(),
                music_genre_parent_id: z.number(),
                music_genre_vanity: z.string(),
              }),
            }),
          ),
        }),
      }),
    }),
  ),
});

export type MxmClientTrackSearchResponse = z.infer<
  typeof mxmClientTrackSearchResponseSchema
>;
