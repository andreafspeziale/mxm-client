import { z } from 'zod';
import { artistSchema } from '../shared.js';

export const ARTIST_GET_METHOD = 'GET' as const;
export const ARTIST_GET_ENDPOINT = '/ws/1.1/artist.get';

export type ArtistGetQuery = {
  artist_id: string;
};

export const mxmClientArtistGetResponseSchema = z.object({
  artist: artistSchema,
});

export type MxmClientArtistGetResponse = z.infer<
  typeof mxmClientArtistGetResponseSchema
>;
