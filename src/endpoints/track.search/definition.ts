import { z } from 'zod';
import { trackSchema } from '../shared.js';

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
  track_list: z.array(z.object({ track: trackSchema })),
});

export type MxmClientTrackSearchResponse = z.infer<
  typeof mxmClientTrackSearchResponseSchema
>;
