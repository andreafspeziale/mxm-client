import { z } from 'zod';
import { analysisSchema } from '../shared.analysis.js';

export const TRACK_LYRICS_ANALYSIS_GET_METHOD = 'GET' as const;
export const TRACK_LYRICS_ANALYSIS_GET_ENDPOINT =
  '/ws/1.1/track.lyrics.analysis.get';

export type TrackLyricsAnalysisGetQuery =
  | {
      track_id: string;
      track_isrc?: never;
      commontrack_id?: never;
    }
  | {
      track_id?: never;
      track_isrc: string;
      commontrack_id?: never;
    }
  | {
      track_id?: never;
      track_isrc?: never;
      commontrack_id: string;
    };

export const mxmClientTrackLyricsAnalysisGetResponseSchema = z.object({
  analysis: analysisSchema,
});

export type MxmClientTrackLyricsAnalysisGetResponse = z.infer<
  typeof mxmClientTrackLyricsAnalysisGetResponseSchema
>;
