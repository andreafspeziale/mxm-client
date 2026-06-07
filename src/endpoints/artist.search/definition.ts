import { z } from 'zod';
import { artistSchema } from '../shared.js';

export const ARTIST_SEARCH_METHOD = 'GET' as const;
export const ARTIST_SEARCH_ENDPOINT = '/ws/1.1/artist.search';

export type ArtistSearchQuery = {
  q_artist: string;
  f_artist_id?: string;
  page?: string;
  page_size?: string;
};

export const mxmClientArtistSearchResponseSchema = z.object({
  artist_list: z.array(z.object({ artist: artistSchema })),
});

export type MxmClientArtistSearchResponse = z.infer<
  typeof mxmClientArtistSearchResponseSchema
>;
