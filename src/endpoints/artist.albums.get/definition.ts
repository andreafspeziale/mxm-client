import { z } from 'zod';
import { albumSchema } from '../shared.js';

export const ARTIST_ALBUMS_GET_METHOD = 'GET' as const;
export const ARTIST_ALBUMS_GET_ENDPOINT = '/ws/1.1/artist.albums.get';

export type ArtistAlbumsGetQuery = {
  artist_id: string;
  // Group by album name: set to '1' to deduplicate albums by name
  g_album_name?: string;
  // Sort by release date: 'asc' or 'desc'
  s_release_date?: string;
  page?: string;
  page_size?: string;
};

export const mxmClientArtistAlbumsGetResponseSchema = z.object({
  album_list: z.array(z.object({ album: albumSchema })),
});

export type MxmClientArtistAlbumsGetResponse = z.infer<
  typeof mxmClientArtistAlbumsGetResponseSchema
>;
