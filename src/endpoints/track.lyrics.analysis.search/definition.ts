import { z } from 'zod';
import { analysisSchema } from '../shared.analysis.js';
import { trackSchema } from '../shared.js';

export const TRACK_LYRICS_ANALYSIS_SEARCH_METHOD = 'POST' as const;
export const TRACK_LYRICS_ANALYSIS_SEARCH_ENDPOINT =
  '/ws/1.1/track.lyrics.analysis.search';

export interface TrackLyricsAnalysisSearchQuery {
  page?: string;
  page_size?: string;
}

export type Mood =
  | 'Love'
  | 'Heartbreak'
  | 'Joy'
  | 'Empowerment'
  | 'Angst'
  | 'Reflection'
  | 'Inspiration'
  | 'Nostalgia'
  | 'Despair'
  | 'Celebration'
  | 'Anger'
  | 'Peace'
  | 'Solitude'
  | 'Adventure'
  | 'Social Commentary'
  | 'Hope'
  | 'Spirituality'
  | 'Freedom'
  | 'Party'
  | 'Nature';

export type Rating = 'G' | 'PG' | 'PG-13' | 'R' | 'NC-17';

export type EntityCategory =
  | 'People & Groups'
  | 'Geographical Locations'
  | 'Events & Periods'
  | 'Cultural Works'
  | 'Organizations & Institutions'
  | 'Products & Brands'
  | 'Concepts & Ideas'
  | 'Diseases';

export type ModerationCategory =
  | 'harassment'
  | 'hate'
  | 'illicit'
  | 'sexual'
  | 'violence'
  | 'harassment/threatening'
  | 'hate/threatening'
  | 'illicit/violent'
  | 'self-harm/intent'
  | 'self-harm/instructions'
  | 'self-harm'
  | 'sexual/minors'
  | 'violence/graphic';

export type TrackLyricsAnalysisSearchEntity =
  | { name: string; category?: EntityCategory }
  | { name?: string; category: EntityCategory };

export interface TrackLyricsAnalysisSearchBody {
  meaning?: string;
  themes?: string[];
  moods?: Mood[];
  rating?: Rating;
  religions?: string[];
  exclude_religions?: boolean;
  entities?: TrackLyricsAnalysisSearchEntity[];
  genre?: string | string[];
  lyrics_language?: string;
  lyrics_explicit?: boolean;
  // NOTE: undocumented field — observed working in live API but not in official docs; may be removed server-side without notice
  has_profanities?: boolean;
  first_release_date?: string;
  needs_moderation?: boolean;
  moderation_categories?: ModerationCategory[];
}

export const mxmClientTrackLyricsAnalysisSearchResponseSchema = z.object({
  track_list: z.array(
    z.object({
      track: trackSchema,
      analysis: analysisSchema,
    }),
  ),
});

export type MxmClientTrackLyricsAnalysisSearchResponse = z.infer<
  typeof mxmClientTrackLyricsAnalysisSearchResponseSchema
>;
