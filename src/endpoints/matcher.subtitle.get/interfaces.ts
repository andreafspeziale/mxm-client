import type { z } from 'zod';
import type { mxmClientMatcherSubtitleGetResponseSchema } from './schema.js';

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

export type MxmClientMatcherSubtitleGetResponse = z.infer<
  typeof mxmClientMatcherSubtitleGetResponseSchema
>;
