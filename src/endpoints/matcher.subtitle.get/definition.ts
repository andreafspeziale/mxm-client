import { z } from 'zod';
import { subtitleSchema } from '../shared.js';

export const MATCHER_SUBTITLE_GET_METHOD = 'GET' as const;
export const MATCHER_SUBTITLE_GET_ENDPOINT = '/ws/1.1/matcher.subtitle.get';

export type MatcherSubtitleGetQuery =
  | {
      track_isrc: string;
      q_track?: never;
      q_artist?: never;
      f_subtitle_length?: string;
      f_subtitle_length_max_deviation?: string;
    }
  | {
      track_isrc?: never;
      q_track: string;
      q_artist: string;
      f_subtitle_length?: string;
      f_subtitle_length_max_deviation?: string;
    };

export const mxmClientMatcherSubtitleGetResponseSchema = z.object({
  subtitle: subtitleSchema,
});

export type MxmClientMatcherSubtitleGetResponse = z.infer<
  typeof mxmClientMatcherSubtitleGetResponseSchema
>;
