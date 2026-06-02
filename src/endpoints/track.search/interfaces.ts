import type { z } from 'zod';
import type { mxmClientTrackSearchResponse } from './schema.js';

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

export type MxmClientTrackSearchResponse = z.infer<
  typeof mxmClientTrackSearchResponse
>;
