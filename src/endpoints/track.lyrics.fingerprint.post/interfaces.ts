import type { z } from 'zod';
import type { mxmClientTrackLyricsFingerprintPostResponseSchema } from './schema.js';

export interface TrackLyricsFingerprintPostQuery {
  size?: number;
  limit?: number;
}

export interface TrackLyricsFingerprintPostBody {
  text: string;
}

export type MxmClientTrackLyricsFingerprintPostResponse = z.infer<
  typeof mxmClientTrackLyricsFingerprintPostResponseSchema
>;
