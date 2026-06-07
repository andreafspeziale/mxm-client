import { z } from 'zod';
import type { ExtendedTrackIdentifierQuery } from '../shared.js';

export const TRACK_SNIPPET_GET_METHOD = 'GET' as const;
export const TRACK_SNIPPET_GET_ENDPOINT = '/ws/1.1/track.snippet.get';

export type TrackSnippetGetQuery = ExtendedTrackIdentifierQuery;

export const snippetSchema = z.object({
  snippet_id: z.number(),
  snippet_body: z.string(),
  snippet_language: z.string(),
  instrumental: z.number(),
  restricted: z.number(),
  updated_time: z.string(),
  html_tracking_url: z.string(),
  pixel_tracking_url: z.string(),
  script_tracking_url: z.string(),
  region_restriction: z
    .object({
      allowed: z.array(z.string()),
      blocked: z.array(z.string()),
    })
    .optional(), // TODO: this is expected from the docs but is not present in the actual response
});

export const mxmClientTrackSnippetGetResponseSchema = z.object({
  snippet: snippetSchema,
});

export type MxmClientTrackSnippetGetResponse = z.infer<
  typeof mxmClientTrackSnippetGetResponseSchema
>;
