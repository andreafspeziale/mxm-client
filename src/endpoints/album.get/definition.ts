import { z } from 'zod';
import { albumSchema } from '../shared.js';

export const ALBUM_GET_METHOD = 'GET' as const;
export const ALBUM_GET_ENDPOINT = '/ws/1.1/album.get';

export type AlbumGetQuery = {
  album_id: string;
};

export const mxmClientAlbumGetResponseSchema = z.object({
  album: albumSchema,
});

export type MxmClientAlbumGetResponse = z.infer<
  typeof mxmClientAlbumGetResponseSchema
>;
